// NOT ANGULAR STYLE - copy and paste form old version

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