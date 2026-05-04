export interface Room {
  slug: string;
  name: string;
  shortName: string;
  category: 'Room' | 'Suite' | 'Extended Stay';
  descriptor: string;
  description: string;
  included: string[];
  sleeps: string;
  goodToKnow: string;
  gradient: string;
  image: string;
  imageAlt: string;
  callDirectOnly?: boolean;
}

export const rooms: Room[] = [
  {
    slug: 'standard-queen',
    name: 'Standard Queen Room',
    shortName: 'Standard Queen',
    category: 'Room',
    descriptor: 'One queen. Extra room. Everything you need.',
    description:
      'One queen bed, one bathroom. Travelers who want to sleep alone with extra room or comfortably with another — this is the room for you. Sleeps one in fine fashion and two comfortably. Add a roll-away for $10/night to accommodate two adults and one child (12 or younger).',
    included: [
      'One queen bed',
      'Private full bath',
      'Fiber-optic Wi-Fi',
      'Flat-screen TV with upgraded cable',
      'Individually controlled heat and AC',
      'Park at your door',
      'Roll-away available: +$10/night (child 12 or younger)',
    ],
    sleeps: '1 in fine fashion, 2 comfortably',
    goodToKnow:
      'The bathrooms built in 1955 are on the smaller side — but the water’s hot and the towels are fresh.',
    gradient: 'from-fox-brown via-deep-red to-fox-brown',
    image: '/images/rooms/standard-queen.jpg',
    imageAlt: 'Standard Queen room at Red Fox Inn — one queen bed, light bedding, retro 1955 motor lodge layout',
  },
  {
    slug: 'deluxe-double',
    name: 'Deluxe Double Room',
    shortName: 'Deluxe Double',
    category: 'Room',
    descriptor: 'Two double beds. Great for friends or a family of four.',
    description:
      'Two double beds, one bathroom. Great for travelers who like their own bed rather than cozying up in one large bed. Or perhaps you’ve brought a couple of young people along. Sleeps four adults tightly or two comfortably.',
    included: [
      'Two double beds',
      'Private full bath',
      'Fiber-optic Wi-Fi',
      'Flat-screen TV with upgraded cable',
      'Individually controlled heat and AC',
      'Park at your door',
    ],
    sleeps: '4 adults tightly, 2 comfortably',
    goodToKnow:
      'A classic 1955 floor plan with a little more elbow room than the Standard Queen.',
    gradient: 'from-night via-fox-brown to-deep-red',
    image: '/images/rooms/deluxe-double.jpg',
    imageAlt: 'Deluxe Double Room at Red Fox Inn — two double beds, sleeps four, classic motor lodge interior',
  },
  {
    slug: 'deluxe-queen',
    name: 'Deluxe Queen Room',
    shortName: 'Deluxe Queen',
    category: 'Room',
    descriptor: 'Two queen beds. Our most spacious standard room.',
    description:
      'Two queen beds, one bathroom. Slightly larger than the Deluxe Double with a bit more elbow room — in case you’re prone to elbowing others when you sleep. Sleeps four comfortably.',
    included: [
      'Two queen beds',
      'Private full bath',
      'Fiber-optic Wi-Fi',
      'Flat-screen TV with upgraded cable',
      'Individually controlled heat and AC',
      'Park at your door',
    ],
    sleeps: '4 comfortably',
    goodToKnow:
      'The biggest of our standard rooms. Request one on the quieter back row if you’d like to turn in early.',
    gradient: 'from-fox-brown via-fox-red to-fox-orange/50',
    image: '/images/rooms/deluxe-queen.jpg',
    imageAlt: 'Deluxe Queen Room at Red Fox Inn — two queen beds, the most spacious standard room',
  },
  {
    slug: 'retro-suite',
    name: 'Retro Suite with Kitchenette',
    shortName: 'Retro Suite',
    category: 'Suite',
    descriptor: 'Queen bed, sofa pullout, kitchenette. Room to spread out.',
    description:
      'One queen bed, one sofa pullout, one bathroom, one kitchenette. For guests traveling with kids, our ground-floor Retro Suite just might be the ticket. Plenty of room to hang out on a rainy day. There’s one bathroom of average hotel size and a small closet and dresser for storage over a holiday weekend. Having a kitchenette is divine.',
    included: [
      'One queen bed + queen-size sofa pullout',
      'Kitchenette: fridge, microwave, coffee maker, sink, utensils',
      'Private full bath',
      'Small closet + dresser',
      'Fiber-optic Wi-Fi',
      'Flat-screen TV with upgraded cable',
      'Individually controlled heat and AC',
      'Park at your door',
    ],
    sleeps: '2 adults + 2 kids',
    goodToKnow:
      'Ground floor only. Call us directly to book this room — this one isn’t on the booking engine.',
    gradient: 'from-deep-red via-fox-red to-fox-orange',
    image: '/images/rooms/retro-suite.jpg',
    imageAlt: 'Retro Suite with kitchenette at Red Fox Inn — queen bed, sofa pullout, fridge and microwave',
    callDirectOnly: true,
  },
  {
    slug: 'extended-ground',
    name: 'Private Extended Stay — Ground Level',
    shortName: 'Extended Stay · Ground',
    category: 'Extended Stay',
    descriptor: 'Full kitchen. Private entrance. Your own place.',
    description:
      'One queen bed, full kitchen, living room, private entrance and parking. Totally remodeled units with entrances away from the hustle and bustle of the main motel. All utilities included — heat, AC, Wi-Fi. Free on-site laundry. Full kitchen with stove/oven, refrigerator, microwave, toaster, coffee maker, dishes, pots & pans. One bathroom with full tub and shower.',
    included: [
      'One queen bed',
      'Living room with seating',
      'Full kitchen: stove/oven, fridge, microwave, toaster, coffee maker, dishes + pots & pans',
      'Full bath with tub and shower',
      'Private entrance + private parking',
      'Heat, AC, fiber-optic Wi-Fi all included',
      'Free on-site laundry',
    ],
    sleeps: '1–2 adults',
    goodToKnow:
      'Weeks Memorial Hospital is 1.25 miles away — popular with traveling medical professionals. Rates discount by the week and month.',
    gradient: 'from-forest-green via-fox-brown to-night',
    image: '/images/rooms/extended-ground.jpg',
    imageAlt: 'Private Extended Stay (Ground Level) at Red Fox Inn — full kitchen, living room, private entrance',
  },
  {
    slug: 'extended-upper',
    name: 'Private Extended Stay — 2nd Floor',
    shortName: 'Extended Stay · Upper',
    category: 'Extended Stay',
    descriptor: 'Full kitchen. Private entrance. Second floor quiet.',
    description:
      'One queen bed, full kitchen, living room, private entrance and parking. Same full-kitchen setup as the ground-level units. Park in front of your unit on the quiet side of Main Street. Great for a weekend getaway to bike, hike, or snowmobile — or for a long-term stay if you’re visiting relatives and they’ve got no room for you. Or, you just don’t gel with cousin Bob.',
    included: [
      'One queen bed',
      'Living room with seating',
      'Full kitchen: stove/oven, fridge, microwave, toaster, coffee maker, dishes + pots & pans',
      'Full bath with tub and shower',
      'Private entrance + private parking',
      'Heat, AC, fiber-optic Wi-Fi all included',
      'Free on-site laundry',
    ],
    sleeps: '1–2 adults',
    goodToKnow:
      'Second floor, quieter side of the building. Call us to book your escape.',
    gradient: 'from-night via-forest-green to-forest-sage/60',
    image: '/images/rooms/extended-upper.jpg',
    imageAlt: 'Private Extended Stay (2nd Floor) at Red Fox Inn — full kitchen, quiet upper-level unit',
    callDirectOnly: true,
  },
];
