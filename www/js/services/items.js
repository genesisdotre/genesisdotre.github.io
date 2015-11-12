app.factory("itemsService", function() {
  var items = [

    {
      url:  "http://genesis.re/wiki",
      name: "Wiki: Main Page",
      desc: "Entry point for the wiki."
    },    
    {
      url:  "http://genesis.re/wiki#Vision",
      name: "Wiki: Vision",
      desc: "We are on the mission.<br>There is a planet that needs saving."
    },
    {
      url:  "http://genesis.re/wiki#Core_Values",
      name: "Wiki: Core Values",
      desc: "Constitution.<br>Operating system.<br>Basic principles."
    },
    {
      url:  "http://genesis.re/wiki#Job",
      name: "Wiki: Consultancy",
      desc: "Working on exceptional projects to generate 10x ROI."
    },

  
    {
      url:  "http://MichalStefanow.com",
      name: "MichalStefanow.com",
      desc: "Personal website.<br>Some pictures and links to social media profiles."
    },
    {
      url:  "http://iamthespecialist.com",
      name: "iamthespecialist.com",
      desc: "Technical blog.<br>The name is pretentious but I enjoy being controversial."
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
      desc: "Taking advantage of favourable market conditions."
    },    
    {
      url:  "http://wardyworks.co.uk",
      name: "Visionary Art",
      desc: "Alexander Ward - author of the visionary artwork"
    },
    {
      url:  "#equity",
      name: "Equity investment",
      desc: "Land and infrastructure.<br>Be part of our long-term vision."
    },
    {
      url:  "http://genesis.re/wiki#Contact",
      name: "Contact",
      desc: "<a href='tel:+44 758 629 4279'>+44 758 629 4279</a><br>" +
            "<a href='mailto:email@genesis.re'>email@genesis.re</a><br>" +
            "Please join us on IRC and Slack channel too.."
    }
  ];

  return {
    get: function() {
      return items;
    }
  };
});