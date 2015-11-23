var app = angular.module("app", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'www/partials/main.html',
      controller: 'MainCtrl'
    })    
    .when('/equity', {
      templateUrl: 'www/partials/equity.html',
      controller: 'EquityCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.filter('safe', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  };
});

app.controller("MainCtrl", function($scope) {

  $scope.items = [
    {
      url:  "https://gen.miraheze.org/",
      name: "Wiki: Main Page",
      desc: "<p><strong>genesis</strong> as in source, beginning, origin</p>" +
            "<p><strong>re</strong> as in renew, reset, restart, reboot, rejuvenate</p>" 
    },    
    {
      url:  "https://gen.miraheze.org/wiki/Vision",
      name: "Wiki: Vision",
      desc: "<p>We are on the mission.</p><p>There is a planet that needs saving.</p>"
    },
    {
      url:  "https://gen.miraheze.org/wiki/Core_Values",
      name: "Wiki: Core Values",
      desc: "<p>Constitution.</p><p>Operating system.</p><p>Basic principles.</p>"
    },
    {
      url:  "https://gen.miraheze.org/wiki/Hackbase",
      name: "Wiki: Hackbase",
      desc: "Creating exceptional work environment."
    },

    {
      url:  "http://MichalStefanow.com",
      name: "MichalStefanow.com",
      desc: "<p>Personal website.</p><p>Some pictures and links to social media profiles.</p>"
    },
    {
      url:  "http://iamthespecialist.com",
      name: "iamthespecialist.com",
      desc: "<p>Technical blog.</p><p>I am the...</p><p>(quantum shift agent)</p>"
    },
    {
      url:  "https://mailhustle.com",
      name: "MailHustle.com",
      desc: "Hustle your email contacts to kickstart your marketing campaigns."
    },    
    {
      url:  "http://hackeryoga.com",
      name: "HackerYoga.com",
      desc: "I do some yoga and I'm not a hacker."
    },


    {
      url:  "http://genesis.re/cruitment",
      name: "Recruitment Agency",
      desc: "Taking advantage of the favourable market conditions."
    },  
    {
      url:  "http://genesis.re/steroids",
      name: "Startup Steroids",
      desc: "<p>I genuinely love helping people.</p><p>Connecting the dots.</p><p>Use my experience to grow your company...</p>"
    },    
    {
      url:  "#equity",
      name: "Equity investment",
      desc: "<p>Land and infrastructure.</p><p>Be part of our long-term vision.<p>"
    },
    {
      url:  "http://genesis.re/wiki#Contact",
      name: "Contact",
      desc: "<p><a href='tel:+44 758 629 4279'>+44 758 629 4279</a></p>" +
            "<p><a href='mailto:email@genesis.re'>email@genesis.re</a></p>"
    }
  ];

});

app.controller("EquityCtrl", function() {
    var valString;
    var valNumber;

    $("#equity-slider").on("change", function() {
      valString = $(this).val();
      valNumber = parseFloat(valString);
      $("#equity-value").html(valNumber.toFixed(1) + "%");
      $("#equity-cost").html("$" + (valNumber * 10000));

      $("#paypal-name").attr("value", valString + "% equity");
      $("#paypal-amount").attr("value", valNumber * 10000);
    }).trigger("change");

    var handler = StripeCheckout.configure({
      key: 'pk_live_2DAE0pRgfhU4eH7NxiQ4jLbD',
      //key: 'pk_test_gorhMMGRx3KOzCuhkkwX6iah',
      image: 'www/images/genesis.png',
      locale: 'auto',
      token: function(token) {
        console.log(token);

        var data = {
          id : token.id,
          howmany : valNumber * 1000000
        };

        //$.post("http://localhost:3002/charge", data, function(response) {
        $.post("https://genesis-charge.herokuapp.com/charge", data, function(response) {
          console.log(response);

          // alert(response + "\r\nwhich is as you can tell is " + (response === "OK" ? "super cool" : "not that good"));

          $('.payments').css({visibility: "hidden"});

          if(response === "OK") {
            $("#thankyou").show();
          } else {
            $("#error").show();
          }

        });

      }
    });

    $('#stripe-button').on('click', function(e) {
      // Open Checkout with further options
      handler.open({
        name: 'genesis.re (Web Summit)',
        description: valNumber.toFixed(1) + "% equity",
        currency: "usd",
        amount: valNumber * 1000000
      });
      e.preventDefault();
    });

    // Close Checkout on page navigation
    $(window).on('popstate', function() {
      handler.close();
    });
});