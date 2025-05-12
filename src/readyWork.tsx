import React, { useState } from "react";
import * as XLSX from 'xlsx';
import icon from "./assets/icon.png";
import axios from 'axios';

import ApiReg from "./apiReg";
import ManaReg from "./manaReg";

function ReadyWork({ onBack }) {
  const [showApiReg, setShowApiReg] = useState(false);
  const [showManaReg, setShowManaReg] = useState(false);
  const host_url = "https://autofill.robosell.jp/";
  const packageJson = require('../package.json');

  const handleClickListDownload = async () => {
    let apiKey = localStorage.getItem("user_api_key");
    let mana_id = localStorage.getItem("user_mana_id");
    
    if (apiKey && mana_id) {
      try {
        const response = await axios.get(`${host_url}api/workList_download`, {
          params: {
            api_key: apiKey,
            mana_id: mana_id,
          }
        });
    
        if (response.status === 200) {
          if (response.data.excel_data) {
            const excel_data = response.data.excel_data;
            const data_count = excel_data.length;
            const worksheet = XLSX.utils.json_to_sheet(excel_data);
    
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
            const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
    
            const a = document.createElement('a');
            a.href = url;
            const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
            const filename = `${mana_id}_${currentDate}_${data_count}件.xlsx`;
            a.download = filename;
            document.body.appendChild(a);
    
            // Trigger the download automatically by clicking the link
            a.click();
    
            // Clean up after download
            setTimeout(() => {
              // Remove the link from the document
              document.body.removeChild(a);
              // Revoke the Blob URL after a short delay
              URL.revokeObjectURL(url);
              console.log('Blob URL revoked after download');
            }, 1000);
          } else { // Excelデータがない場合
            alert("作業リストがありません。");
          }
        } else {
          alert("作業リストのダウンロードに失敗しました。" + response.data.message);
        }
      } catch (error) {
        // Handle HTTP errors
        if (error.response) {
          // The server responded with a status code outside of 2xx
          alert("サーバーエラーが発生しました。ステータスコード: " + error.response.status + "\nメッセージ: " + error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          alert("サーバーに接続できませんでした。");
        } else {
          // Something else caused an error
          alert("エラーが発生しました: " + error.message);
        }
      }
    } else {
      alert("APIキーとリストIDがありません。");
    }  }

  if (showApiReg) {
    return <ApiReg onBack={() => setShowApiReg(false)} />;
  } else if (showManaReg) {
    return <ManaReg onBack={() => setShowManaReg(false)} />;
  }

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
      <div className="bg-amber-100 py-4">
        <div className="flex justify-between p-2 px-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={() => {
              console.log(showApiReg)
              setShowApiReg(true)
              console.log(showApiReg)
            }}
          >
            APIキー登録
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={() => setShowManaReg(true)}
          >
            リストID登録
          </button>
        </div>
        <div className="flex justify-between p-2 px-6">
          <button className="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={handleClickListDownload}
          >
            作業リストDL
          </button>
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

export default ReadyWork;
