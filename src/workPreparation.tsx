import React, { useState } from "react";
import icon from "./assets/icon.png";
import WorkListDownload from "./workListDownload";
import ListAdditionApplication from "./listAdditionApplication";

function WorkPreparation({ onBack }) {
  const [showDownload, setShowDownload] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const packageJson = require('../package.json');

  if (showDownload) {
    return <WorkListDownload onBack={() => setShowDownload(false)} />;
  } else if (showApplication) {
    return <ListAdditionApplication onBack={() => setShowApplication(false)} />;
  }

  return (
    <div className="font-sans">
      <div className="flex justify-center items-end pl-16 pr-4 bg-black h-[50px] w-[350px]">
        <div className="bg-white h-[76%] mx-2 px-2 mb-1">
          <img className="h-full w-full" src={icon} alt="logo_robosell" />
        </div>
        <div className="text-2xl text-white text-center p-2">
          Robosell
        </div>
        <div className="bg-slate-300 px-4 mx-4 text-sm mb-1">
          {packageJson.version}
        </div>
      </div>
      <div className="bg-amber-100 py-4">
        <div className="flex justify-between p-2 px-6">
          <button 
            className="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={() => setShowDownload(true)}
          >
            作業リストDL
          </button>
          <button 
            className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={() => setShowApplication(true)}
          >
            リスト追加申請
          </button>
        </div>
        <div className="flex justify-center p-2">
          <button 
            className="py-2 px-6 mx-4 rounded-lg text-sm font-medium bg-teal-200 text-teal-800"
            onClick={onBack}
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkPreparation;
