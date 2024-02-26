document.addEventListener("DOMContentLoaded", async () => {
	const backendEndpoint = "http://localhost:4242/";
	const { publishableKey } = await fetch(`${backendEndpoint}config`).then((r) =>
		r.json()
	);
	if (!publishableKey) {
		alert("Please set your Stripe publishable API key in the .env file");
	}

	const stripe = Stripe(publishableKey, {
		apiVersion: "2023-10-16",
	});

	// On page load, we create a PaymentIntent on the server so that we have its clientSecret to
	// initialize the instance of Elements below. The PaymentIntent settings configure which payment
	// method types to display in the PaymentElement.

	const {
		error: backendError,
		clientSecret,
		amount,
	} = await fetch(
		`${backendEndpoint}create-${
			window.location.hash === "#testing" ? "test" : "payment"
		}-intent`
	).then((r) => r.json());

	const appearance = {
		theme: "night",
		variables: {
			colorPrimary: "#ffffff",
			colorBackground: "#010304",
			colorText: "#ffffff",
			colorDanger: "#df1b41",
			fontFamily: "monospace",
			spacingUnit: "2px",
			borderRadius: "4px",
			// See all possible variables below
		},
	};
	const costAmountElement = document.getElementById("cost-nft");

	// Assign the value to the element
	costAmountElement.textContent = `${amount} € ${
		window.location.hash === "#testing" ? "TESTING ONLY" : ""
	}`;
	// Initialize Stripe Elements with the PaymentIntent's clientSecret,
	// then mount the payment element.
	const elements = stripe.elements({ clientSecret, appearance });
	const paymentElement = elements.create("payment");
	paymentElement.mount("#payment-element");
	// Create and mount the linkAuthentication Element to enable autofilling customer payment details
	const linkAuthenticationElement = elements.create("linkAuthentication");
	linkAuthenticationElement.mount("#link-authentication-element");
	// If the customer's email is known when the page is loaded, you can
	// pass the email to the linkAuthenticationElement on mount:
	//
	//   linkAuthenticationElement.mount("#link-authentication-element",  {
	//     defaultValues: {
	//       email: 'jenny.rosen@example.com',
	//     }
	//   })
	// If you need access to the email address entered:
	//
	//  linkAuthenticationElement.on('change', (event) => {
	//    const email = event.value.email;
	//    console.log({ email });
	//  })

	// When the form is submitted...
	const form = document.getElementById("payment-form");
	let submitted = false;
	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Disable double submission of the form
		if (submitted) {
			return;
		}
		submitted = true;
		form.querySelector("button").disabled = true;

		const nameInput = document.querySelector("#name");

		// Confirm the payment given the clientSecret
		// from the payment intent that was just created on
		// the server.
		const { error: stripeError } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/return.html`,
			},
		});

		if (stripeError) {
			// reenable the form.
			submitted = false;
			form.querySelector("button").disabled = false;
			return;
		}
	});
});
