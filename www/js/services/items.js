app.factory("itemsService", function() {
  var items = [

    {
      url:  "http://genesis.re/wiki",
      name: "Wiki: Main Page",
      desc: "Entry point for genesis wiki. Main Page."
    },    
    {
      url:  "http://genesis.re/wiki#Vision",
      name: "Wiki: Vision",
      desc: "We are on the mission. There is a planet that needs saving."
    },
    {
      url:  "http://genesis.re/wiki#Core_Values",
      name: "Wiki: Core Values",
      desc: "Constitution. Operating system. Basic principles."
    },
    {
      url:  "http://genesis.re/wiki#Job",
      name: "Wiki: Consultancy",
      desc: "Willing to work on exceptional projects to generate 10x ROI."
    },

  
    {
      url:  "http://MichalStefanow.com",
      name: "MichalStefanow.com",
      desc: "Personal website. Some pictures and links to social media profiles."
    },
    {
      url:  "http://iamthespecialist.com",
      name: "iamthespecialist.com",
      desc: "Technical blog. The name is pretentious but I enjoy being controversial."
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
      desc: "Current stage - tired of seeking co-founder - starting up on my own."
    },    
    {
      url:  "http://wardyworks.co.uk",
      name: "Visionary Art",
      desc: "Alexander Ward - author of the visionary artwork"
    },
    {
      url:  "#equity",
      name: "Equity investment",
      desc: "Investment in land and infrastructure. Be part of our long-term vision."
    },
    {
      url:  "http://genesis.re/wiki#Contact",
      name: "Contact",
      desc: "<a href='tel:+44 758 629 4279'>+44 758 629 4279</a><br>" +
            "<a href='mailto:email@gensis.re'>email@gensis.re</a><br>" +
            "Please join us on IRC and Slack channel too.."
    }
  ];

  return {
    get: function() {
      return items;
    }
  };
});