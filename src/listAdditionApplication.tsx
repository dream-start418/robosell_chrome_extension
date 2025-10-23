import React, { useState, useEffect } from "react";
import icon from "./assets/icon.png";
import axios from 'axios';

function ListAdditionApplication({ onBack }) {
  const [contractId, setContractId] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const packageJson = require('../package.json');
  const host_url = "https://autofill.robosell.jp/";

  // Load saved values on component mount
  useEffect(() => {
    const savedContractId = localStorage.getItem("contract_id");
    const savedWorkerId = localStorage.getItem("worker_id");
    if (savedContractId) setContractId(savedContractId);
    if (savedWorkerId) setWorkerId(savedWorkerId);
  }, []);

  const handleApplication = async () => {
    if (!contractId || !workerId) {
      setMessage("契約IDとワーカーIDを入力してください。");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${host_url}api/process_list_request`, {
        contract_id: contractId,
        worker_id: workerId,
      });

      if (response.status === 201) {
        setMessage("リスト追加申請が完了しました。Chatworkをご確認ください。");
        // Save the values for future use
        localStorage.setItem("contract_id", contractId);
        localStorage.setItem("worker_id", workerId);
      } else {
        setMessage("申請に失敗しました: " + response.data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 203) {
          setMessage("リスト追加は申請済みです。Chatworkをご確認ください。");
        } else if (error.response.status === 202) {
          setMessage("契約が終了しています。");
        } else {
          setMessage("エラー: " + error.response.data.message);
        }
      } else if (error.request) {
        setMessage("サーバーに接続できませんでした。");
      } else {
        setMessage("エラーが発生しました: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              契約ID
            </label>
            <input
              type="text"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              placeholder="契約ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ワーカーID
            </label>
            <input
              type="text"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              placeholder="ワーカーID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {message && (
            <div className="mb-4 p-2 text-sm text-center bg-blue-100 text-blue-800 rounded">
              {message}
            </div>
          )}
        </div>
        <div className="flex justify-between p-2 px-6">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-base disabled:opacity-50"
            onClick={handleApplication}
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : "申請する"}
          </button>
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-base"
            onClick={onBack}
          >
            戻る
          </button>
        </div>
        <div className="flex justify-center p-2">
          <button 
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded text-sm"
            onClick={() => {
              setContractId("");
              setWorkerId("");
              setMessage("");
            }}
          >
            クリア
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListAdditionApplication;
