import React, { useEffect, useState } from "react";
import icon from "./assets/icon.png";
import axios from 'axios';

function ApiReg({ onBack }) {
  const [apiKey, setApiKey] = useState("");

  const host_url = "https://autofill.robosell.jp/";

  const checkApiKey = async (apiKey) => {
    if (apiKey) {
      const response = await axios.get(`${host_url}api/check_extension_apikey`, {
        params: {
          api_key: apiKey,
        }
      });
      const scriptData = response.data;
      return scriptData.apiKey_check;
    }
  };

  const handleRegKeyClick = async () => {
    if (apiKey) {
      const checked_flag = await checkApiKey(apiKey);
      if (checked_flag) {
        localStorage.setItem("user_api_key", apiKey);
        localStorage.setItem("user_mana_id", "");
        alert("情報が正しく設定されました。");
      }
      else {
        alert("情報が相違しています。");
      }
    } else {
      alert("情報が相違しています。");
    }
  };

  useEffect(() => {
    const storedApiKey = localStorage.getItem("user_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const packageJson = require('../package.json');


  return (
    <div className="font-sans">
      <div className="flex justify-center items-end pl-16 pr-4 bg-black h-[50px] w-[350px] ">
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
      <div className="flex items-center bg-amber-100 py-4">
        <div className="w-1/4">
          <label className="block text-gray-500 font-bold text-right mb-1 mb-0 pr-4">
            APIキー
          </label>
        </div>
        <div className="w-2/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="api_key"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API_KEY"
          />
        </div>
      </div>
      <div className="flex items-center justify-center bg-amber-100 pt-2 pb-6 w-full">
        <button
          className="py-2 px-6 mx-4 rounded-lg text-sm font-medium text-white bg-teal-600"
          onClick={handleRegKeyClick}
        >
          保存
        </button>
        <button
          className="py-2 px-6 mx-4 rounded-lg text-sm font-medium bg-teal-200 text-teal-800"
          onClick={onBack}
        >
          戻る
        </button>
      </div>
    </div>
  );
}

export default ApiReg;
