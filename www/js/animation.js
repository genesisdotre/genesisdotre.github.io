var animation = function() {
  var canvas;
  var context;
  var canvas_div;
  var outer_div;
  var boundary = 10;


  var canvas_width = window.innerWidth;
  var canvas_heigth = window.innerHeight;

  var follow_distance = canvas_width/1.15;
  var stir_distance = canvas_width/8;
  var blow_distance = canvas_width/2;
  var num_vertices = 300;
  var vertices = [];
  var viscosity = .96;
  var mouse_x, mouse_y, mouse_vx, mouse_vy, previous_mouse_x = 0, previous_mouse_y = 0;
  var is_mouse_down = false;
  var active_canvas = 0;

  function init() {
    canvas = document.getElementById("animation");
    if(canvas.getContext) {
      setup();
      setInterval(run, 50);
    }
  }

  function setup() {
    outer_div = document.getElementById("outer");
    canvas_div = document.getElementById("canvas_container");
    context = canvas.getContext("2d");
    var i = num_vertices;
    while(i--) {
      var vertex = new Vertex(canvas_width/2, canvas_heigth/2);
      vertex.vx = Math.cos(i)*Math.random()*25;
      vertex.vy = Math.sin(i)*Math.random()*25;
      vertices.push(vertex);
    }
    document.onmousedown = on_mouse_down;
    document.onmouseup = on_mouse_up;
    document.onmousemove = on_mouse_move;
    document.onkeypress = on_key_press;
  }

  function run() {
    if(freeze_frame_switch) { return; }
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "rgba(8, 8, 12, .65)";
    context.fillRect(0, 0, canvas_width, canvas_heigth);
    context.globalCompositeOperation = "lighter";
    context.strokeStyle = "white";
    mouse_vx = mouse_x-previous_mouse_x;
    mouse_vy = mouse_y-previous_mouse_y;
    previous_mouse_x = mouse_x;
    previous_mouse_y = mouse_y;
    var minV = 0;
    var maxV = 0;
    init_delaunay();
    var i = num_vertices;
    while(i--) {
      var vertex = vertices[i];
      var x = vertex.x;
      var y = vertex.y;
      var vx = vertex.vx;
      var vy = vertex.vy;
      var dx = x-mouse_x;
      var dy = y-mouse_y;
      var distance = Math.sqrt(dx*dx+dy*dy);
      var angle = Math.atan2(dy, dx);
      var cos_angle = Math.cos(angle);
      var sin_angle = Math.sin(angle);
      if(is_mouse_down) {
          if(distance<blow_distance) {
            var blow_acceleration = (1-(distance/blow_distance))*14;
            vx += cos_angle*blow_acceleration+.5-Math.random();
            vy += sin_angle*blow_acceleration+.5-Math.random();
         }
      }
      if(distance<follow_distance) {
        var follow_acceleration = (1-(distance/follow_distance))*canvas_width*.0008;
        vx -= cos_angle*follow_acceleration;
        vy -= sin_angle*follow_acceleration;
      }
      if(distance<stir_distance) {
        var stir_acceleration = (1-(distance/stir_distance))*canvas_width*.00022;
        vx += mouse_vx*stir_acceleration;
        vy += mouse_vy*stir_acceleration;
      }
      vx *= viscosity;
      vy *= viscosity;
      var abs_vx = Math.abs(vx);
      var abs_vy = Math.abs(vy);
      if(abs_vx<.1) vx*=Math.random()*3;
      if(abs_vy<.1) vy*=Math.random()*3;
      var next_x = x+vx;
      var next_y = y+vy;
      if(next_x>canvas_width) {
        next_x = canvas_width;
        vx *= -1;
      }
      else if(next_x<0) {
        next_x = 0;
        vx *= -1;
      }
      if(next_y>canvas_heigth) {
        next_y = canvas_heigth;
        vy *= -1;
      }
      else if(next_y<0) {
        next_y = 0;
        vy *= -1;
      }
      vertex.vx=vx;
      vertex.vy=vy;
      vertex.x=next_x;
      vertex.y=next_y;
      var velocity_sqr=vx*vx + vy*vy;
      if(velocity_sqr<minV) minV=velocity_sqr;
      if(velocity_sqr>maxV) maxV=velocity_sqr;
      vertex.payload["velocity"] = velocity_sqr;
      insert(vertex);
    }

    var velocity_range = maxV-minV;
    var velocity_mid = (maxV-minV)/2;
    edges.each(function(an_edge){
      var org = an_edge.org();
      var right = an_edge.right();
      var dest = an_edge.dest();
      var left = an_edge.left();
      if(crust_skeleton_switch && !an_edge.is_infinite_edge()) {
        if(an_edge.is_crust()){ draw_line(right, left, 2); }
        else{ draw_line(org, dest, 2); }
      }
      if(delaunay_switch) {
        if(!an_edge.is_infinite_edge()) draw_line(org, dest, 2);
        if(color_switch && !an_edge.is_infinite_edge()){
          if(left.payload["painted"]==false && !an_edge.onext().is_infinite_edge()) {
            onext_velocity=0;
            [an_edge.org().payload["velocity"], an_edge.dest().payload["velocity"], an_edge.onext().dest().payload["velocity"]].each(function(velocity){onext_velocity += velocity/3;});
            onext_color=heatmap(velocity_range, velocity_mid, onext_velocity);
            draw_triangle(org, dest, an_edge.onext().dest(), onext_color);
            left.payload["painted"]=true;
          }

          if(right.payload["painted"]==false && !an_edge.oprev().is_infinite_edge()) {
            oprev_velocity=0;
            [an_edge.org().payload["velocity"], an_edge.dest().payload["velocity"], an_edge.oprev().dest().payload["velocity"]].each(function(velocity){oprev_velocity += velocity/3;});
            oprev_color=heatmap(velocity_range, velocity_mid, oprev_velocity);
            draw_triangle(org, dest, an_edge.oprev().dest(), oprev_color);
            right.payload["painted"]=true;
          }
        }
      }
      if(voronoi_switch) {
        if(!an_edge.is_infinite_edge()) draw_line(right, left, 2);
        if(color_switch) {
          var org_color = heatmap(velocity_range, velocity_mid, an_edge.org().payload["velocity"]);
          var dest_color = heatmap(velocity_range, velocity_mid, an_edge.dest().payload["velocity"]);
          if(!org.is_infinity && right!=null && left!=null) { draw_triangle(org, right, left, org_color); }
          if(!dest.is_infinity && right!=null && left!=null) { draw_triangle(dest, left, right, dest_color); }
        }
      }
    });
  }

  function draw_line(from, to, line_width) {
    context.lineWidth = line_width;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.closePath();
    context.stroke();
  }

  function draw_triangle(v0, v1, v2, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(v0.x, v0.y);
    context.lineTo(v1.x, v1.y);
    context.lineTo(v2.x, v2.y);
    context.lineTo(v0.x, v0.y);
    context.closePath();
    context.fill();
  }

  function heatmap(velocity_range, velocity_mid, velocity) {
    var heat = (velocity-velocity_mid) / velocity_range;
    var green, blue;
    var red = heat > 0 ? heat : 0;
    var green = (1 - Math.abs(heat))/2;
    var blue = heat < 0 ? -heat : 0;
    var heat_color="rgb("+Math.floor(red*255)+","+Math.floor(green*255)+","+Math.floor(blue*255)+")";
    return heat_color;
  }

  function on_mouse_move(e) {
    var ev = e ? e : window.event;
    mouse_x = ev.clientX - outer_div.offsetLeft - canvas_div.offsetLeft;
    mouse_y = ev.clientY - outer_div.offsetTop  - canvas_div.offsetTop;
    mouse_x = clip(mouse_x, boundary, canvas_width-boundary);
    mouse_y = clip(mouse_y, boundary, canvas_heigth-boundary);
  }

  var freeze_frame_key='f';
  var freeze_frame_switch=false;
  var crust_skeleton_key='s';
  var crust_skeleton_switch=false;
  var voronoi_key='p';
  var voronoi_switch=true;
  var delaunay_key='t';
  var delaunay_switch=false;
  var color_key='c';
  var color_switch=true;
  var valid_keys=[crust_skeleton_key,voronoi_key,delaunay_key,color_key,freeze_frame_key];
  function on_key_press(e) {
    key = String.fromCharCode(e.which);
    if(valid_keys.indexOf(key)==-1) return;
    if(key==color_key) { color_switch=!color_switch; return; }
    if(key==freeze_frame_key) { freeze_frame_switch=!freeze_frame_switch; return; }
    delaunay_switch=key==delaunay_key;
    voronoi_switch=key==voronoi_key;
    crust_skeleton_switch=key==crust_skeleton_key;
  }

  function clip(value, lower_bound, upper_bound) {
    value = value < lower_bound ? lower_bound : value > upper_bound ? upper_bound : value;
    return value;
  }

  function on_mouse_down(e) {
    is_mouse_down = true;
    return false;
  }

  function on_mouse_up(e) {
    is_mouse_down = false;
    return false;
  }

  //=================================
  //=================================

  function Edge() {
    this.data=null;
    this.next=null;
    this.rot=null;
  }

  Edge.prototype.splice = function(e) {
    var e_1 = this.next.rot;
    var e_2 = e.next.rot;
    var e_3 = this.next;
    this.next = e.next;
    e.next = e_3;
    var e_3 = e_1.next;
    e_1.next = e_2.next;
    e_2.next = e_3;
  }

  Edge.prototype.swap = function() {
    var e_0 = this.oprev();
    var e_1 = this.sym().oprev();
    this.splice(e_0);
    this.sym().splice(e_1);
    this.splice(e_0.lnext());
    this.sym().splice(e_1.lnext());
    this.set_org(e_0.dest());
    this.set_dest(e_1.dest());
  }

  Edge.prototype.sym = function() { return this.rot.rot; }
  Edge.prototype.irot = function() { return this.rot.rot.rot; }
  Edge.prototype.org = function() { return this.data; }
  Edge.prototype.set_org = function(v) { this.data = v; }
  Edge.prototype.right = function() { return this.rot.data; }
  Edge.prototype.set_right = function(v) { this.rot.data = v; }
  Edge.prototype.dest = function() { return this.rot.rot.data; }
  Edge.prototype.set_dest = function(v) { this.rot.rot.data = v; }
  Edge.prototype.left = function() { return this.rot.rot.rot.data; }
  Edge.prototype.set_left = function(v) { this.rot.rot.rot.data = v; }
  Edge.prototype.set_org_dest = function(o, d) { this.set_org(o); this.set_dest(d); }
  Edge.prototype.onext = function() { return this.next; }
  Edge.prototype.rnext = function() { return this.rot.next.rot.rot.rot; }
  Edge.prototype.dnext = function() { return this.rot.rot.next.rot.rot; }
  Edge.prototype.lnext = function() { return this.rot.rot.rot.next.rot; }
  Edge.prototype.oprev = function() { return this.rot.next.rot; }
  Edge.prototype.rprev = function() { return this.rot.rot.next; }
  Edge.prototype.dprev = function() { return this.rot.rot.rot.next.rot.rot.rot; }
  Edge.prototype.lprev = function() { return this.next.rot.rot; }
  Edge.prototype.is_crust = function() { return in_circle(this.left(), this.org(), this.right(), this.dest()); }
  Edge.prototype.is_infinite_edge = function() { return this.org().is_infinity || this.dest().is_infinity; }
  Edge.prototype.vertex_left_of = function(v) { return is_left_of(v, this.org(), this.dest()); }
  Edge.prototype.vertex_right_of = function(v) { return is_right_of(v, this.org(), this.dest()); }
  Edge.prototype.vertex_colinear = function(v) { return colinear(v, this.org(), this.dest()); }
  Edge.prototype.to_s = function() { return "org="+this.org().to_s()+" dest="+this.dest().to_s(); }

  //=========================
  //=========================

  function Vertex(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0.
    this.vy = 0.
    this.payload = {"velocity":0, "painted":false};
    this.is_infinity = false;
  }

  Vertex.prototype.to_s = function() { return "[" + this.x + ", " + this.y + "]"; }
  Vertex.prototype.equals = function(v) { return this.x == v.x && this.y == v.y; }

  function in_circle(v0, v1, v2, v3) {
    var circle_test = (v2.x - v1.x) * (v3.y - v1.y) * (v0.x*v0.x + v0.y*v0.y - v1.x*v1.x - v1.y*v1.y)
    + (v3.x - v1.x) * (v0.y - v1.y) * (v2.x*v2.x + v2.y*v2.y - v1.x*v1.x - v1.y*v1.y)
    + (v0.x - v1.x) * (v2.y - v1.y) * (v3.x*v3.x + v3.y*v3.y - v1.x*v1.x - v1.y*v1.y)
    - (v2.x - v1.x) * (v0.y - v1.y) * (v3.x*v3.x + v3.y*v3.y - v1.x*v1.x - v1.y*v1.y)
    - (v3.x - v1.x) * (v2.y - v1.y) * (v0.x*v0.x + v0.y*v0.y - v1.x*v1.x - v1.y*v1.y)
    - (v0.x - v1.x) * (v3.y - v1.y) * (v2.x*v2.x + v2.y*v2.y - v1.x*v1.x - v1.y*v1.y);
    return circle_test >= 0.0;
  }

  function area(v0, v1, v2) { return (v1.x - v0.x)*(v2.y - v0.y) - (v2.x - v0.x)*(v1.y - v0.y); }
  function dist_sqr(v0, v1) { return (v1.x - v0.x)*(v1.x - v0.x) + (v1.y - v0.y)*(v1.y - v0.y); }
  function colinear(v0, v1, v2) { return area(v1, v0, v2) == 0.0; }
  function is_right_of(v0, v1, v2) { return area(v0, v1, v2) > 0.0; }
  function is_left_of(v0, v1, v2) { return area(v0, v1, v2) < 0.0; }

  //=========================
  //=========================

  var rot_map = [1,2,3,0]
  var next_map = [0,3,2,1]
  function make_quadedge() {
    var e =[new Edge(),new Edge(),new Edge(),new Edge()];
    for(var ie=0; ie<4; ie++){
      e[ie].rot=e[rot_map[ie]];
      e[ie].next=e[next_map[ie]];
    }
    return e[0];
  }

  Array.prototype.each = function(f) { for(var ia=0; ia<this.length; ia++){ f(this[ia]); } }
  function delete_quadedge(q) { disconnect_edge(q); [q, q.rot, q.sym(), q.irot()].each( function(qq){ delete qq; }); }

  //=========================
  //=========================
  var edge = null;
  var edges = [];
  var circumcenters = [];
  var infinite_vertices=[new Vertex(0.0,-5000.0), new Vertex(-10000.0, 5000.0), new Vertex(10000.0, 5000.0)];
  function init_delaunay(){
    edges.each(function(qe){ delete_quadedge(qe); });
    edges.length=0
    circumcenters.each(function(cc){ delete cc; });
    circumcenters.length=0
    infinite_vertices.each(function(vertex){ vertex.is_infinity = true; });
    edges[0] = make_quadedge();
    edges[2] = make_quadedge();
    edges[0].set_org_dest(infinite_vertices[1], infinite_vertices[2]);
    edges[2].set_org_dest(infinite_vertices[1], infinite_vertices[0]);
    edges[0].splice(edges[2]);
    edges[2] = edges[2].sym();
    edges[1] = connect(edges[0], edges[2]);
    edge = edges[0];
  }

  function is_inside_cosmic_triangle(v) {
    var cosmic = true;
    [edges[0], edges[1], edges[2]].each(function(e){ cosmic &= e.vertex_left_of(v); });
    return cosmic;
  }

  var max_search_iterations = 1000;
  function locate(v) {
    var search_iterations = 0;
    if(edge.vertex_right_of(v)){ edge = edge.sym(); }
    while( true ) {
      if(search_iterations++ > max_search_iterations || v.equals(edge.org()) || v.equals(edge.dest())){ throw "LocateException"; }
      if(!edge.onext().vertex_right_of(v)) { edge = edge.onext(); continue; }
      if(!edge.dprev().vertex_right_of(v)) { edge = edge.dprev(); continue; }
      return edge;
    }
  }

  function disconnect_edge(e) {
    e.splice(e.oprev());
    e.sym().splice(e.sym().oprev());
  }

  function circumcenter(v0, v1, v2) {
    var denominator = (v1.y - v2.y)*(v1.x - v0.x) - (v1.y - v0.y)*(v1.x - v2.x);
    var num0 = ((v0.x + v1.x)*(v1.x - v0.x))/2.0 + ((v1.y - v0.y)*(v0.y + v1.y))/2.0;
    var num1 = ((v1.x + v2.x)*(v1.x - v2.x))/2.0 + ((v1.y - v2.y)*(v1.y + v2.y))/2.0;
    var x = (num0*(v1.y - v2.y) - num1*(v1.y - v0.y))/denominator;
    var y = (num1*(v1.x - v0.x) - num0*(v1.x - v2.x))/denominator;
    var c = new Vertex(x, y);
    circumcenters.push(c);
    return c;
  }

  function connect(e0, e1) {
    var e2 = make_quadedge();
    e2.set_org_dest(e0.dest(), e1.org());
    e2.splice(e0.lnext());
    e2.sym().splice(e1);
    return e2;
  }

  function set_circumcenter(e, cc) {
    var cc = circumcenter(e.dest(), e.org(), e.onext().dest());
    circumcenters.push(cc);
    e.set_left(cc);
    e.lnext().set_left(cc);
    e.lprev().set_left(cc);
  }

  function insert(vertex) {
    if(!is_inside_cosmic_triangle(vertex)){ return; }
    try{
      locate(vertex);
    }
    catch(exception) {
      if(exception=="LocateException") { return; }
      alert(exception);
    }
    if(edge.vertex_colinear(vertex)) {
      var tmp = edge.oprev();
      disconnect_edge(edge);
      delete_quadedge(edge);
      edge = tmp;
    }
    var e2 = make_quadedge();
    edges.push(e2);
    var v1 = edge.org();
    e2.set_org_dest(v1, vertex);
    e2.splice(edge);
    do {
      var e2 = connect(edge, e2.sym());
      edges.push(e2);
      edge = e2.oprev();
    } while(edge.dest() != v1);
    while( true ) {
      var e3 = edge.oprev();
      if(edge.vertex_right_of(e3.dest()) && in_circle(vertex, edge.org(), e3.dest(), edge.dest())) {
        edge.swap();
        set_circumcenter(edge);
        edge = edge.oprev();
      }
      else {
        if(edge.org() == v1) {
            set_circumcenter(edge);
            return;
        }
        set_circumcenter(edge);
        edge = edge.onext().lprev();
      }
    }
  }

  return init;
};