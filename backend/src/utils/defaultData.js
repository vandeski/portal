const { v4: uuidv4 } = require("uuid");

module.exports = {
  defaultData: [
    {
      name: "Session 1",
      id: uuidv4(),
      order: 1,
      questions: [
        {
          question: "Pirates or ninjas?",
          order: 1,
        },
        {
          question: "What do you like most about your family?",
          order: 2,
        },
        {
          question: "What is one of the great values that guides your life?",
          order: 3,
        },
      ],
    },
    {
      name: "Session 2",
      id: uuidv4(),
      order: 2,
      questions: [
        {
          question: "Who inspires you to be better?",
          order: 1,
        },
        {
          question: "What's something you wish you'd figured out sooner?",
          order: 2,
        },
        {
          question: "What was the best compliment you've ever received?",
          order: 3,
        },
      ],
    },
    {
      name: "Session 3",
      id: uuidv4(),
      order: 3,
      questions: [
        {
          question: "Favorite city?",
          order: 1,
        },
        {
          question:
            "When was the last time you changed your opinion about something major?",
          order: 2,
        },
        {
          question: "What is your theme song?",
          order: 3,
        },
      ],
    },
  ],
};
