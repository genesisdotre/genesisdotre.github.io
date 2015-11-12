app.factory("itemsService", function() {
  var items = [

    {
      url:  "http://genesis.re/wiki",
      name: "Wiki: Main Page",
      desc: "<p><strong>genesis</strong> as in source, beginning, origin</p>" +
            "<p><strong>re</strong> as in renew, reset, restart, reboot, rejuvenate</p>" 
    },    
    {
      url:  "http://genesis.re/wiki#Vision",
      name: "Wiki: Vision",
      desc: "<p>We are on the mission.</p><p>There is a planet that needs saving.</p>"
    },
    {
      url:  "http://genesis.re/wiki#Core_Values",
      name: "Wiki: Core Values",
      desc: "<p>Constitution.</p><p>Operating system.</p><p>Basic principles.</p>"
    },
    {
      url:  "http://genesis.re/wiki#Job",
      name: "Wiki: Consultancy",
      desc: "Working on exceptional projects to generate 10x ROI."
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
      url:  "http://wardyworks.co.uk",
      name: "Visionary Art",
      desc: "Alexander Ward - author of the visionary artwork"
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
            "<p><a href='mailto:email@genesis.re'>email@genesis.re</a></p>" +
            "<p>Please join us on IRC and Slack channel too...</p>"
    }
  ];

  return {
    get: function() {
      return items;
    }
  };
});