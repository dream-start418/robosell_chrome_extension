import { useState, useEffect } from "react"
import axios from 'axios';

import "./style.css"
import MultiUrl from "./multiPages"
import icon from "./assets/icon.png";
import update_icon from "./assets/update_1.png";
import ReadyWork from "./readyWork";


const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  page_url,
}) => {
  const sendPageNotFound = async (page_url) => {
    const host_url = "https://autofill.robosell.jp/";
    let apiKey = localStorage.getItem("user_api_key");
    let mana_id = localStorage.getItem("user_mana_id");
    if (apiKey) {
      const response = await axios.get(`${host_url}api/set_extension_urlNotFound`, {
        params: {
          api_key: apiKey,
          page_url: page_url,
          mana_id: mana_id,
        }
      });
      console.log(response);
      onClose();
    }
  }
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="text-sm text-gray-700">{message}</p>
        <button
          onClick={() => sendPageNotFound(page_url)}
          className="mt-4 mx-8 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          報告
        </button>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          戻る
        </button>
      </div>
    </div>
  );
};

function IndexPopup() {
  const [showReadyWork, setShowReadyWork] = useState(false);
  const [showMultiurl, setShowMultiUrl] = useState(false);
  const [isPanelVisible, setPanelVisible] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [modalContent, setModalContent] = useState({ title: "", message: "", page_url: "" }); // Modal content state
  const [todaySuccessCount, setTodaySuccessCount] = useState(0);
  const [checkConnection, setCheckConnection] = useState("");

  useEffect(() => {
    chrome.storage.local.get(['checkboxState'], function (result) {
      const checkboxState = result.checkboxState === 'true';
      setPanelVisible(checkboxState);
    });
  }, []);

  const handleShowPanel = async (event: any) => {
    const checked = event.target.checked;
    setPanelVisible(checked);
    await chrome.storage.local.set({ checkboxState: checked.toString() }, function () {
      console.log('Checkbox state is set to: ' + checked.toString());
    });

    if (checked) {
      const sendData = await getUserData();
      await chrome.storage.local.set({ modalData: sendData }, function () {
        console.log('modalData state is set to: ' + sendData);
      });
    }
  };

  const getCurrentDomain = async () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          const url = new URL(tabs[0].url);
          resolve(url.hostname);
        }
      });
    });
  };

  const host_url = "https://autofill.robosell.jp/";
  const getUserData = async () => {
    let apiKey = localStorage.getItem("user_api_key");
    let mana_id = localStorage.getItem("user_mana_id");
    if (apiKey) {
      let domain = await getCurrentDomain();
      const response = await axios.get(`${host_url}api/get_extension_data`, {
        params: {
          api_key: apiKey,
          domain: domain,
          mana_id: mana_id,
        }
      });
      console.log(response);
      const scriptData = JSON.parse(response.data.user_data);
      localStorage.setItem("MFORM_MODAL_DATA", scriptData);
      return scriptData;
    }
  };

  const compareVersions = (version1, version2) => {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0; // Use 0 if the version part is missing
      const num2 = v2[i] || 0;

      if (num1 < num2) return -1; // version1 is less than version2
      if (num1 > num2) return 1;  // version1 is greater than version2
    }
    return 0; // versions are equal
  }

  const packageJson = require('../package.json');

  // const getVersion = async () => {
  //   const response = await axios.get(`${host_url}api/get_extension_version`) as any;
  //   if(response.state == "SUCCESS") {
  //     return compareVersions(response.version, packageJson.version)
  //   }
  //   else {
  //     return 0
  //   }

  // }

  const handleAutoFillClick = async () => {
    const sendData = await getUserData();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "AUTOFILL", data: sendData }, (response) => {
          console.log(response)
        })
      }
    })
    await chrome.storage.local.set({ modalData: sendData }, function () {
      console.log('modalData state is set to: ' + sendData);
    });
  }

  const handleManualCopy = async () => {
    const sendData = await getUserData();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "MANUAL_COPY", data: sendData, user_api_key: localStorage.getItem("user_api_key"), user_mana_id: localStorage.getItem("user_mana_id") }, (response) => {
          console.log(response)
        })
      }
    })
    await chrome.storage.local.set({ modalData: sendData }, function () {
      console.log('modalData state is set to: ' + sendData);
    });
  }

  // const handleRegisterResult = async () => {
  //   const sendData = await getUserData();
  //   // console.log(sendData);
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     if (tabs[0]?.id) {
  //       chrome.tabs.sendMessage(tabs[0].id, { action: "REGISTER_RESULT", data: sendData, user_api_key: localStorage.getItem("user_api_key"), user_mana_id: localStorage.getItem("user_mana_id") }, (response) => {
  //         console.log("cache message_state");
  //         console.log(response)
  //       })
  //     }
  //   })
  // }
  const handleRegisterResult = async () => {
    const sendData = await getUserData();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        const currentTabUrl = tabs[0].url; // Get the current tab's URL

        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "REGISTER_RESULT",
            data: sendData,
            user_api_key: localStorage.getItem("user_api_key"),
            user_mana_id: localStorage.getItem("user_mana_id"),
          },
          (response) => {
            if (response === undefined) {
              console.error("Failed to send message. URL:", currentTabUrl);
              setModalContent({
                title: "メッセージ送信失敗",
                message: `ページ: ${currentTabUrl} へのメッセージの送信に失敗しました。送信ボタンをクリックして、この情報をサーバーに報告してください。`,
                page_url: currentTabUrl,
              });
              setModalVisible(true);
            } else {
              console.log("Response received:", response);
            }
          }
        );
      }
    });
  };
  useEffect(() => {
    const getVersion = async () => {
      try {
        const response = await axios.get(`${host_url}api/get_extension_version`);
        if (response.data.state === "SUCCESS") {
          // Set `showUpdateMessage` if the remote version is greater than the local version
          setShowUpdateMessage(compareVersions(response.data.version, packageJson.version) > 0);
        }
      } catch (error) {
        console.error("Error fetching version:", error);
      }
    };

    getVersion();
    const getSuccessCount = async () => {
      let apiKey = localStorage.getItem("user_api_key");
      let mana_id = localStorage.getItem("user_mana_id");
      try {
        const response = await axios.get(`${host_url}api/get_success_count?api_key=${apiKey}&mana_id=${mana_id}`);
        if (response.data.state === "Success") {
          setTodaySuccessCount(response.data.successCount);
          setCheckConnection("");
        } else {
          console.log(response.data.message);
          setCheckConnection("接続失敗")
        }
      } catch (error) {
        setCheckConnection("接続失敗")
      }
    }
    getSuccessCount();
  }, []);


  // const iconUrl = chrome.runtime.getURL("icon.png");
  if (showReadyWork) {
    return <ReadyWork onBack={() => setShowReadyWork(false)} />;
  } else if (showMultiurl) {
    return <MultiUrl onBack={() => setShowMultiUrl(false)} />;
  }

  return (
    <div className="font-sans">
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        message={modalContent.message}
        page_url={modalContent.page_url}
      />
      <div className="flex justify-center items-end pl-16 pr-4 bg-black h-[50px] w-[350px] ">
        {showUpdateMessage && (
          <div className="absolute left-0 top-1 text-white w-10 h-10">
            <a href="https://chromewebstore.google.com/detail/fkicmlfgclckdmdebmhbjjfgnnhpodld?hl=ja&utm_source=ext_sidebar" target="_blank">
              <img className="h-full w-full" src={update_icon} alt="update" />
            </a>
          </div>
        )}
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
        <div className="flex justify-center p-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={handleAutoFillClick}
          >
            自動入力
          </button>
        </div>
        <div className="flex justify-center p-2">
          <label className="w-full flex items-center cursor-pointer justify-center">
            <span className="ms-3 text-lg text-gray-900 font-bold mr-4"
            >
              入力パッド自動表示
            </span>
            <input type="checkbox" className="sr-only peer" id="enableShowPannel"
              onChange={handleShowPanel}
              checked={isPanelVisible}
            />
            <div className="relative w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-5 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex justify-between p-2 px-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={handleManualCopy}>
            入力パッド手動コピー</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={handleRegisterResult}>
            結果登録
          </button>
        </div>
        <div className="flex justify-between p-2 px-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded text-base"
            onClick={() => setShowMultiUrl(true)} >
            一括ページ展開
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-base"
            onClick={() => setShowReadyWork(true)} >
            作業準備
          </button>
        </div>
        <div className="flex justify-center p-2 px-6 text-lg">
          {/* <a href="https://autofill.robosell.jp/login" target="_blank">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-4 text-base">ログイン画面</button>
          </a>
          <a href="https://robosell.jp/usefulcontent/" target="_blank">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-4 text-base">お知らせ</button>
          </a> */}
          <span>本日の送信成功数：</span><span className="text-blue-800">{(checkConnection === "")?todaySuccessCount:""}</span><span className="text-blue-800">{(checkConnection !== "") && checkConnection}</span>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
