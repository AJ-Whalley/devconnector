const profile = {
  experiences: [
    {
      current: false,
      _id: "5b375463ee6dff448858f751",
      title: "Legend",
      company: "Venturis",
      from: "2017-04-02T00:00:00.000Z",
      to: "2018-05-05T00:00:00.000Z",
      description: "Such a legend!"
    },
    {
      current: false,
      _id: "5b37544a1656a14465dae83e",
      title: "Legend",
      company: "Venturis",
      from: "2017-04-02T00:00:00.000Z",
      to: "2018-05-05T00:00:00.000Z",
      description: "Such a legend!"
    }
  ]
};
const experiences = profile.experiences;

// const newExperienceArray = experiences.filter(experience => {
//   if (experience._id !== "5b37544a1656a14465dae83e") {
//     return experience;
//   }
// });

experiences.splice(
  experiences.findIndex(exp => exp._id === "5b37544a1656a14465dae83e"),
  1
);

// console.log(experiences);
console.log(experiences);
