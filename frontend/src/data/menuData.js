export const menuData = {
  food: [
    {
      category: "Starters",
      items: [
        {
          id: 1,
          name: "Jerk Wings",
          description: "Crispy chicken wings marinated in our signature jerk spice blend, served with mango dipping sauce",
          price: 129,
          tags: ["popular", "spicy"],
          image: "https://images.pexels.com/photos/27556985/pexels-photo-27556985.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
          id: 2,
          name: "Plantain Chips",
          description: "Thinly sliced sweet plantains, fried to golden perfection with sea salt",
          price: 69,
          tags: ["vegan"],
          image: null
        },
        {
          id: 3,
          name: "Coconut Shrimp",
          description: "Jumbo shrimp coated in coconut flakes, served with pineapple chili sauce",
          price: 149,
          tags: ["popular"],
          image: null
        },
        {
          id: 4,
          name: "Callaloo Fritters",
          description: "Traditional Caribbean greens mixed with spices and deep fried",
          price: 89,
          tags: ["vegan"],
          image: null
        }
      ]
    },
    {
      category: "Main Courses",
      items: [
        {
          id: 5,
          name: "Caribbean Shrimp Pasta",
          description: "Creamy garlic pasta with jumbo shrimp, bell peppers, and Caribbean spices",
          price: 219,
          tags: ["popular"],
          image: "https://images.pexels.com/photos/31235404/pexels-photo-31235404.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
          id: 6,
          name: "Chicken Roti",
          description: "Tender curried chicken wrapped in soft, flaky roti bread with potatoes and chickpeas",
          price: 179,
          tags: ["popular"],
          image: "https://customer-assets.emergentagent.com/job_carib-menu/artifacts/5uv4l9sc_Roti.jpg"
        },
        {
          id: 7,
          name: "Jerk Chicken Platter",
          description: "Half chicken marinated 24hrs in jerk spices, grilled over pimento wood. Served with rice & peas",
          price: 199,
          tags: ["spicy", "popular"],
          image: null
        },
        {
          id: 8,
          name: "Curry Goat",
          description: "Slow-cooked goat in aromatic curry sauce with potatoes, served with festival",
          price: 229,
          tags: ["spicy"],
          image: null
        },
        {
          id: 9,
          name: "Oxtail Stew",
          description: "Braised oxtail in rich gravy with butter beans, served with rice & peas",
          price: 249,
          tags: ["popular"],
          image: null
        },
        {
          id: 10,
          name: "Grilled Red Snapper",
          description: "Whole red snapper seasoned with Caribbean herbs, served with bammy and festival",
          price: 289,
          tags: ["new"],
          image: null
        }
      ]
    },
    {
      category: "Seafood Specials",
      items: [
        {
          id: 11,
          name: "Garlic Butter Lobster Tail",
          description: "Caribbean lobster tail grilled with garlic herb butter, served with coconut rice",
          price: 349,
          tags: ["new"],
          image: null
        },
        {
          id: 12,
          name: "Seafood Rundown",
          description: "Mixed seafood simmered in coconut milk with okra and Caribbean spices",
          price: 279,
          tags: ["spicy"],
          image: null
        },
        {
          id: 13,
          name: "Pepper Shrimp",
          description: "Spicy sautéed shrimp with scotch bonnet peppers and garlic",
          price: 199,
          tags: ["spicy"],
          image: null
        }
      ]
    },
    {
      category: "Sides",
      items: [
        {
          id: 14,
          name: "Rice & Peas",
          description: "Traditional coconut rice with kidney beans and thyme",
          price: 49,
          tags: ["vegan"],
          image: null
        },
        {
          id: 15,
          name: "Fried Plantains",
          description: "Sweet ripe plantains caramelized to perfection",
          price: 49,
          tags: ["vegan"],
          image: null
        },
        {
          id: 16,
          name: "Coleslaw",
          description: "Creamy Caribbean-style coleslaw with a hint of lime",
          price: 39,
          tags: [],
          image: null
        },
        {
          id: 17,
          name: "Festival",
          description: "Sweet fried dumplings, perfect with any dish",
          price: 45,
          tags: ["vegan"],
          image: null
        }
      ]
    }
  ],
  drinks: [
    {
      category: "Rum Cocktails",
      items: [
        {
          id: 101,
          name: "Caribbean Punch",
          description: "Our signature rum punch with tropical fruits and a secret spice blend",
          price: 129,
          tags: ["popular"],
          image: "https://images.unsplash.com/photo-1692746931486-22b6c7feb80e?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        {
          id: 102,
          name: "Dark & Stormy",
          description: "Dark rum, ginger beer, lime, and bitters",
          price: 119,
          tags: [],
          image: null
        },
        {
          id: 103,
          name: "Mojito Caribeño",
          description: "White rum, fresh mint, lime, and a splash of passion fruit",
          price: 129,
          tags: ["popular"],
          image: null
        },
        {
          id: 104,
          name: "Piña Colada",
          description: "Coconut cream, pineapple, and aged rum blended to perfection",
          price: 139,
          tags: [],
          image: null
        },
        {
          id: 105,
          name: "Ti' Punch",
          description: "Traditional French Caribbean cocktail with rhum agricole and lime",
          price: 109,
          tags: ["new"],
          image: null
        }
      ]
    },
    {
      category: "Mocktails",
      items: [
        {
          id: 201,
          name: "Virgin Punch",
          description: "All the tropical flavor without the rum - passion fruit, mango, and pineapple",
          price: 79,
          tags: ["popular"],
          image: null
        },
        {
          id: 202,
          name: "Sorrel Cooler",
          description: "Traditional hibiscus drink with ginger and cinnamon",
          price: 69,
          tags: ["vegan"],
          image: null
        },
        {
          id: 203,
          name: "Coconut Lime Refresher",
          description: "Fresh coconut water with lime and mint",
          price: 69,
          tags: ["vegan"],
          image: null
        },
        {
          id: 204,
          name: "Mango Sunrise",
          description: "Fresh mango puree with orange juice and grenadine",
          price: 79,
          tags: [],
          image: null
        }
      ]
    },
    {
      category: "Beer & Cider",
      items: [
        {
          id: 301,
          name: "Red Stripe",
          description: "Jamaican lager - crisp and refreshing",
          price: 69,
          tags: ["popular"],
          image: null
        },
        {
          id: 302,
          name: "Carib Lager",
          description: "Trinidad's finest - light and smooth",
          price: 69,
          tags: [],
          image: null
        },
        {
          id: 303,
          name: "Banks Beer",
          description: "Barbados premium beer",
          price: 69,
          tags: [],
          image: null
        },
        {
          id: 304,
          name: "Local Craft Selection",
          description: "Ask your server for today's Swedish craft beer selection",
          price: 79,
          tags: ["new"],
          image: null
        }
      ]
    },
    {
      category: "Wine",
      items: [
        {
          id: 401,
          name: "House White",
          description: "Crisp Sauvignon Blanc - perfect with seafood",
          price: 89,
          tags: [],
          image: null
        },
        {
          id: 402,
          name: "House Red",
          description: "Smooth Merlot - pairs well with jerk dishes",
          price: 89,
          tags: [],
          image: null
        },
        {
          id: 403,
          name: "Sparkling",
          description: "Celebration bubbles - ask for our selection",
          price: 129,
          tags: [],
          image: null
        }
      ]
    },
    {
      category: "Soft Drinks",
      items: [
        {
          id: 501,
          name: "Ting",
          description: "Jamaican grapefruit soda",
          price: 39,
          tags: [],
          image: null
        },
        {
          id: 502,
          name: "Ginger Beer",
          description: "Spicy Caribbean ginger beer",
          price: 45,
          tags: ["spicy"],
          image: null
        },
        {
          id: 503,
          name: "Fresh Coconut Water",
          description: "Served in the shell when available",
          price: 59,
          tags: ["vegan"],
          image: null
        }
      ]
    }
  ]
};

export const aboutData = {
  title: "Vår Historia",
  subtitle: "Från Musik till Mat",
  story: [
    "Vi träffades genom den gemensamma passionen för musik, vilket gjorde att några samarbeten och låtar senare så blev vi så nära vänner att vi blev som familj för varandra.",
    "Vi kom fram till att vi båda älskade matlagning också, och hur kul det vore att starta något ihop i framtiden.",
    "10 år senare blev det till en sanning och idag finns vi, Carib Hut, mitt nere i Västerås stadskärna: Aseatorget.",
    "Välkomna!"
  ],
  founders: [
    {
      name: "Marcus",
      role: "Grundare & Kökschef",
      quote: "Mat är hur vi delar vår kultur och vår kärlek."
    },
    {
      name: "David",
      role: "Grundare & Verksamhet",
      quote: "Vi serverar inte bara mat – vi serverar minnen."
    }
  ]
};

export const contactData = {
  address: "Aseatorget, 72217 Västerås",
  phone: "+46 21 123 4567",
  email: "hello@caribhut.se",
  hours: {
    weekdays: "Tis - Tor: 11:00 - 22:00",
    friday: "Fre: 11:00 - 23:00",
    saturday: "Lör: 12:00 - 23:00",
    sunday: "Sön: 12:00 - 20:00",
    monday: "Mån: Stängt"
  },
  social: {
    instagram: "@caribhut.vasteras",
    facebook: "Carib Hut Västerås"
  }
};
