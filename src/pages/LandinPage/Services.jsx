import React from "react";
import peerEvaluation from '../../assets/imgs/peerevaluation.png';
import projectProposal from '../../assets/imgs/projectproposal.png';
import teamFormation from '../../assets/imgs/teamformation.png';

const Services = () => {
  return (
    <div>
      {/* Services Section */}
      <div id="services" className="hidden lg:flex flex-col items-center mt-12">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">Services</h1>
        <h3 className="text-xl mb-10 text-center text-gray-600">
            We offer these comprehensive and efficient services:
        </h3>
        <div className="flex flex-col gap-10">
          {/* Service 1: Team Formation */}
          <div className="team-formation bg-peach text-white p-8 w-80 h-40 mr-60 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <img src={teamFormation} alt="Team Formation" className="w-24 h-24 mb-0"/>
            <h3 className="text-lg font-semibold text-center">Team Formation</h3>
          </div>

          {/* Service 2: Project Proposal */}
          <div className="project-proposal bg-teal text-white p-8 w-80 h-40 ml-60 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <img src={projectProposal} alt="Peer Evaluation" className="w-24 h-24 mb-0"/>
            <h3 className="text-lg font-semibold text-center">Project Proposal</h3>
          </div>

          {/* Service 3: Peer Evaluation */}
          <div className="peer-evaluation bg-peach text-white p-8 w-80 h-40 mr-60 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <img src={peerEvaluation} alt="Peer Evaluation" className="w-24 h-24 mb-0"/>
            <h3 className="text-lg font-semibold text-center">Peer Evaluation</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
