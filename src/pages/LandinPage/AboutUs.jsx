import React from "react";
import heatherImage from "../../assets/imgs/heather.jpg";
import alexaImage from "../../assets/imgs/alexa.jpg";
import zekeImage from "../../assets/imgs/zeke.jpg";
import reyImage from "../../assets/imgs/rey.jpg";
import drich from "../../assets/imgs/drich.jpg";

const developers = [
  { name: "Hezekiah Dane D. Meñoso", image: zekeImage },
  { name: "Rey Anthony M. Novero", image: reyImage },
  { name: "Heather Wen L. Calunod", image: heatherImage },
  { name: "Alexandra Mae C. Gabisay", image: alexaImage },
  { name: "Aldrich Alex Arisgar", image: drich },
];

const DeveloperCard = ({ name, image }) => {
  return (
    <div className="relative group">
      <div
        className="bg-cover bg-center rounded-lg h-72 transition-all duration-300"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 flex rounded-lg justify-center items-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300">
          <p className="text-white text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
};

//for the love of God, please change ky wala na bagay
//says the person nga dile kamao mo design haha
const AboutUs = () => {
  return (
    <div className="w-full py-10">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-semibold mb-6 text-gray-900">
          About Us
          <span role="img" aria-label="developer">
            👩‍💻
          </span>
        </h2>
        <p className="text-xl mb-10 text-gray-600">
          Meet the team who made the project
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {developers.map((developer, index) => (
            <DeveloperCard
              key={index}
              name={developer.name}
              image={developer.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
