import React, { useState, useEffect } from "react";
import icon from "./assets/icon.png";
import axios from 'axios';

function WorkListDownload({ onBack }) {
  const [apiKey, setApiKey] = useState("");
  const [listId, setListId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const packageJson = require('../package.json');
  const host_url = "https://autofill.robosell.jp/";

  // Load saved values on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("user_api_key");
    const savedListId = localStorage.getItem("user_mana_id");
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedListId) setListId(savedListId);
  }, []);

  const handleDownload = async () => {
    if (!apiKey || !listId) {
      setMessage("APIキーとリストIDを入力してください。");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.get(`${host_url}api/workList_download`, {
        params: {
          api_key: apiKey,
          mana_id: listId,
        }
      });

      if (response.status === 200) {
        if (response.data.excel_data) {
          // Convert to Excel and download
          const XLSX = require('xlsx');
          const excel_data = response.data.excel_data;
          const worksheet = XLSX.utils.json_to_sheet(excel_data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

          const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          const currentDate = new Date().toISOString().split('T')[0];
          const filename = `${listId}_${currentDate}_${excel_data.length}件.xlsx`;
          a.download = filename;
          document.body.appendChild(a);
          a.click();

          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 1000);

          setMessage("ダウンロードが完了しました。");
          // Save the values for future use
          localStorage.setItem("user_api_key", apiKey);
          localStorage.setItem("user_mana_id", listId);
        } else {
          setMessage("作業リストがありません。");
        }
      } else {
        setMessage("ダウンロードに失敗しました: " + response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setMessage("エラー: " + error.response.data.message);
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
        <div className="">
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
          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              リストID
            </label>
            <input
              type="text"
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              placeholder="リストID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          <div className="flex items-center bg-amber-100 py-4">
            <div className="w-1/4">
              <label className="block text-gray-500 font-bold text-right mb-1 mb-0 pr-4">
                リストID
              </label>
            </div>
            <div className="w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="mana_id"
                type="text"
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                placeholder=""
              />
            </div>
          </div>
          {/* {message && (
            <div className="mb-4 p-2 text-sm text-center bg-blue-100 text-blue-800 rounded">
              {message}
            </div>
          )} */}
        </div>
        <div className="flex justify-between p-2 px-6">
          <button 
            className="py-2 px-6 mx-4 rounded-lg text-sm font-medium text-white bg-teal-600"
            onClick={handleDownload}
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : "ダウンロードする"}
          </button>
          <button 
            className="py-2 px-6 mx-4 rounded-lg text-sm font-medium bg-teal-200 text-teal-800"
            onClick={onBack}
          >
            戻る
          </button>
        </div>
        {/* <div className="flex justify-center p-2">
          <button 
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded text-sm"
            onClick={() => {
              setApiKey("");
              setListId("");
              setMessage("");
            }}
          >
            クリア
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default WorkListDownload;
