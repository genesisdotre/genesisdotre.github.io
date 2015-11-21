app.factory("itemsService", function() {
  var items = [

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
      desc: "<p>Technical blog.</p><p>The name is pretentious but I enjoy being controversial.</p>"
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
      desc: "<p>I genuinely love helping people.</p><p>Connecting the dots.</p><p>Offering my experience to grow your company on steroids</p>"
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

  return {
    get: function() {
      return items;
    }
  };
});
