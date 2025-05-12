import "./content.css";
import { useEffect, useState } from "react";
let multi_result_modal_flag = false;
const handleAutofill = (message: any) => {
  if (message.action === "AUTOFILL") {
    const formData = message.data;
    const fields = document.querySelectorAll("input, textarea");
    const inputs = [
      { selector: 'input[name*="last_name"]', key: "last_name" },
      { selector: 'input[name*="lastname"]', key: "last_name" },
      { selector: 'input[name*="surname"]', key: "last_name" },
      { selector: 'input[name*="fullname1"]', key: "last_name" },
      { selector: 'input[name*="first_name"]', key: "first_name" },
      { selector: 'input[name*="firstname"]', key: "first_name" },
      { selector: 'input[name*="forename"]', key: "first_name" },
      { selector: 'input[name="fullname2"]', key: "first_name" },
      { selector: 'input[name*="full_name"]', key: "full_name" },
      { selector: 'input[name*="name"]', key: "full_name" },
      { selector: 'input[name*="ご担当者名"]', key: "full_name" },
      { selector: 'input[name*="last_hira"]', key: "last_hira" },
      { selector: 'input[name*="kana_sei"]', key: "last_hira" },
      { selector: 'input[name*="kana_surname"]', key: "last_hira" },
      { selector: 'input[name*="first_hira"]', key: "first_hira" },
      { selector: 'input[name*="kana_mei"]', key: "first_hira" },
      { selector: 'input[name*="kana_forename"]', key: "first_hira" },
      { selector: 'input[name*="full_hira"]', key: "full_hira" },
      { selector: 'input[name*="name_kana"]', key: "full_hira" },
      { selector: 'input[name="kana"]', key: "full_hira" },
      { selector: 'input[name*="company"]', key: "company" },
      { selector: 'input[name*="kaisya"]', key: "company" },
      { selector: 'input[name*="会社名"]', key: "company" },
      { selector: 'input[name*="company_hira"]', key: "company_hira" },
      { selector: 'input[name*="department"]', key: "department" },
      { selector: 'input[name*="belongs"]', key: "department" },
      { selector: 'input[name*="部署名"]', key: "department" },
      { selector: 'input[name*="business"]', key: "business" },
      { selector: 'input[name*="job"]', key: "job" },
      { selector: 'input[name*="position"]', key: "job" },
      { selector: 'input[name*="service_fee"]', key: "service_fee" },
      { selector: 'input[name="post"]', key: "post" },
      { selector: 'input[name="post_num"]', key: "post" },
      { selector: 'input[name="post1"]', key: "post1" },
      { selector: 'input[name="zip_first"]', key: "post1" },
      { selector: 'input[name="zipcode[data][0]"]', key: "post1" },
      { selector: 'input[name="post2"]', key: "post2" },
      { selector: 'input[name="zip_under"]', key: "post2" },
      { selector: 'input[name="zipcode[data][1]"]', key: "post2" },
      { selector: 'input[name*="address"]', key: "address" },
      { selector: 'input[name*="pref"]', key: "address" },
      { selector: 'select[name*="county"]', key: "address" },
      { selector: 'input[name*="city"]', key: "city" },
      { selector: 'input[name*="street"]', key: "street" },
      { selector: 'input[name*="building"]', key: "building" },
      { selector: 'input[name="tel"]', key: "tel" },
      { selector: 'input[name="your-tel"]', key: "tel" },
      { selector: 'input[name*="電話番号"]', key: "tel" },
      { selector: 'input[name*="tel1"]', key: "tel1" },
      { selector: 'input[name*="tel[data][0]"]', key: "tel1" },
      { selector: 'input[name*="tel_first', key: "tel1" },
      { selector: 'input[name*="tel2"]', key: "tel2" },
      { selector: 'input[name*="tel[data][1]"]', key: "tel2" },
      { selector: 'input[name*="tel_middle', key: "tel2" },
      { selector: 'input[name*="tel3"]', key: "tel3" },
      { selector: 'input[name*="tel[data][2]"]', key: "tel3" },
      { selector: 'input[name*="tel_under', key: "tel3" },
      { selector: 'input[name*="email"]', key: "email" },
      { selector: 'input[name*="mail"]', key: "email" },
      { selector: 'input[name*="メールアドレス"]', key: "email" },
      { selector: 'input[name*="website"]', key: "website" },
      { selector: 'input[name*="employee"]', key: "employee" },
      { selector: 'textarea[name*="content"]', key: "content" },
      { selector: 'textarea[name*="message"]', key: "content" },
      { selector: 'textarea[name*="your-message"]', key: "content" },
    ];

    inputs.forEach(({ selector, key }) => {
      const input = document.querySelector(selector) as any;
      if (input && formData[key]) {
        input.value = formData[key];
      }
    });

    fields.forEach((field: any) => {
      const fieldName = field.getAttribute("name");
      if (formData[fieldName]) {
        field.value = formData[fieldName];
      }
    });
  }
};

const openResultModal = (data: any) => {
  const closeResultModal = () => {
    const modal = document.querySelector('.mxResultModal');
    if (modal) modal.remove();
  };
  console.log(data);
  // data.custom_no = data.custom_no || '-';
  data.customer_id = data.customer_id || '-';
  data.customer_option = data.customer_option || 'その他NG';
  data.contact_url = data.contact_url || '-';
  if (data.contact_url != "-") {
    data.contact_url = new URL(data.contact_url).hostname
  }
  data.company_name = data.company_name || '-';

  const createResultModal = () => {
    const mResultModal = document.createElement('div');
    mResultModal.classList.add('mxResultModal');
    mResultModal.id = "RmxResultModal";

    const mResultContent = document.createElement('div');
    mResultContent.classList.add('ResultModal-content');
    mResultContent.setAttribute('id', 'mResultContentDiv');

    const resultBtnContainer = document.createElement('div');
    resultBtnContainer.classList.add('result-container');

    let infoTableHtml = '';
    if (data.customer_id === '-') {
      infoTableHtml = `
        <thead><tr><th>顧客ID</th><th>企業名</th><th>URL</th></tr></thead>
        <tbody>
          <tr><td colspan="2"><input type="text" id="ref_client_id_2"></td><td><button id="ref_client_btn_2">取得</button></td></tr>
        </tbody>`;
    } else {
      infoTableHtml = `
        <thead><tr><th>顧客ID</th><th>企業名</th><th>URL</th></tr></thead>
        <tbody>
          <tr><td id="customer_id_td">${data.customer_id}</td><td>${data.company_name}</td><td>${data.contact_url}</td></tr>
        </tbody>`;
    }

    // const resultOptionsHtml = `
    //   <option value="0">送信成功</option>
    //   <option value="1">営業拒否</option>
    //   <option value="2">文字数超え</option>
    //   <option value="3">フォームなし</option>
    //   <option value="4">送信エラー</option>
    //   <option value="5">その他NG</option>`;
    const resultOptions = [
      { value: "0", text: "送信成功" },
      { value: "1", text: "フォームなし" },
      { value: "2", text: "対象外" },
      { value: "3", text: "営業拒否" },
      { value: "4", text: "ページ存在なし" },
      { value: "5", text: "文字数超え" },
      { value: "6", text: "送信エラー" },
      { value: "7", text: "その他NG" },
    ];

    let resultOptionsHtml = '';
    resultOptions.forEach(option => {
      const selected = option.text === data.customer_option ? 'selected' : '';
      // console.log(option.text, "----", data.customer_option, "--=", selected)
      resultOptionsHtml += `<option value="${option.value}" ${selected}>${option.text}</option>`;
    });


    const infoResultModal = document.createElement('table');
    infoResultModal.classList.add('ResultInfo');
    infoResultModal.setAttribute('id', 'mResultInfo');
    infoResultModal.innerHTML = infoTableHtml;

    resultBtnContainer.appendChild(infoResultModal);

    const xrlabel = document.createElement('label');
    xrlabel.className = 'xrLabel';
    xrlabel.htmlFor = 'mRXResult';
    const resultXR = document.createElement('select');
    resultXR.classList.add('RXResult');
    resultXR.setAttribute('id', 'mRXResult');
    resultXR.innerHTML = resultOptionsHtml;
    xrlabel.appendChild(resultXR);

    const resultXRbtn = document.createElement('button');
    resultXRbtn.classList.add('XRresultSendBtn');
    resultXRbtn.setAttribute('id', 'mMFSendResultBtn');
    resultXRbtn.disabled = data.customer_id === '-' || data.customer_id == null;
    resultXRbtn.innerHTML = '結果登録';

    const mForm_CONTENT = '';
    const addition_memo = document.createElement('input');
    addition_memo.setAttribute('placeholder', "報告する内容があれば入力ください");
    addition_memo.classList.add("additionInput");
    addition_memo.setAttribute('id', 'addition_memo');
    if (data.memo != "") addition_memo.value = data.memo;

    resultBtnContainer.appendChild(xrlabel);
    resultBtnContainer.appendChild(resultXRbtn);
    resultBtnContainer.appendChild(addition_memo);

    const closeContainer = document.createElement('div');
    closeContainer.classList.add('close-container');

    const crossMFModal = document.createElement('span');
    crossMFModal.classList.add('RXclose');
    crossMFModal.setAttribute('id', 'mRXclose');
    crossMFModal.innerHTML = '&times;';
    crossMFModal.onclick = closeResultModal;

    closeContainer.appendChild(crossMFModal);

    resultBtnContainer.appendChild(closeContainer);
    mResultContent.appendChild(resultBtnContainer);
    mResultModal.appendChild(mResultContent);

    document.body.appendChild(mResultModal);
    document.getElementById('RmxResultModal').style.display = 'block'
  };

  if (multi_result_modal_flag) closeResultModal();
  createResultModal();
  multi_result_modal_flag = true;

  document.querySelectorAll('.mformClip, .content-textarea').forEach((element) => {
    element.addEventListener('click', () => {
      let value = (element as HTMLElement).innerText || (element as HTMLInputElement).value;
      navigator.clipboard.writeText(value).catch((err) => {
        console.error('Failed to copy: ', err);
      });
      closeResultModal();
    });
  });

  document.getElementById('ref_client_btn_2')?.addEventListener('click', async () => {
    const sel_id = (document.getElementById('ref_client_id_2') as HTMLInputElement).value;
    console.log(sel_id);
    try {
      const host_url = "https://autofill.robosell.jp/";
      const mForm_CURRENT_DOMAIN = window.location.hostname;
      const user_api_key = localStorage.getItem("user_api_key");
      const manaId = localStorage.getItem("user_mana_id");
      console.log(localStorage.getItem("user_api_key"));
      try {
        const response = await fetch(`${host_url}api/get_text_data?api_key=${user_api_key}&sel_id=${sel_id}`);
        const result = await response.json();

        if (result.type !== 'GetSuccess') {
          alert(result.message);
          return;
        }
        // document.querySelector('.content-textarea')!.textContent = result.message;
        (document.getElementById('mMFSendResultBtn') as HTMLButtonElement).disabled = false;
        const url = new URL(result.url);
        const domain = url.hostname;
        const infoTableHtml = `
        <thead><tr><th>顧客ID</th><th>企業名</th><th>URL</th></tr></thead>
        <tbody>
          <tr><td id="customer_id_td">${result.customer_id}</td><td>${result.company_name}</td><td>${domain}</td></tr>
        </tbody>`;
        const cur_table = document.getElementById("mResultInfo");
        cur_table.innerHTML = infoTableHtml;
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    } catch (error) {
      alert('アップデート作業中です。完了次第、ご利用できます。\n作業を中断して今しばらくお待ちください。');
    }
  });

  document.getElementById('mMFSendResultBtn')?.addEventListener('click', async () => {
    const option_id = (document.getElementById('mRXResult') as HTMLSelectElement).value;
    const customer_id = document.getElementById('customer_id_td')?.textContent || '';
    try {
      const host_url = "https://autofill.robosell.jp/";
      const manaId = localStorage.getItem("user_mana_id");
      const mForm_CURRENT_DOMAIN = window.location.hostname;
      const mForm_CURRENT_URL = window.location.href;
      const mForm_CONTENT = document.getElementById('mformMFDiv');
      const addition_text = (document.getElementById('addition_memo') as HTMLInputElement).value;
      const user_api_key = localStorage.getItem("user_api_key");
      const response = await fetch(`${host_url}api/send_result_site?api_key=${user_api_key}&domain=${mForm_CURRENT_DOMAIN}&option_id=${option_id}&contact_url=${mForm_CURRENT_URL}&content=${mForm_CONTENT}&customer_id=${customer_id}&memo=${addition_text}&manaId=${manaId}`);
      const result = await response.json();

      if (result.type !== 'OperationSuccess') {
        alert(result.message);
        return;
      }

      alert(result.message);
    } catch (error) {
      alert('アップデート作業中です。完了次第、ご利用できます。\n作業を中断して今しばらくお待ちください。');
    }
  });
};




let selected_input_element = null;
const displayModal = async (data, closeAction) => {
  const createElementDiv = (leftLabel, mForm_data, rightLabels, buttonClass) => {
    const newMFDiv = document.createElement("div");
    newMFDiv.className = "row-item-div";

    const newMFDivLeft = document.createElement("div");
    newMFDivLeft.className = "row-item-div-left";
    newMFDivLeft.textContent = leftLabel;

    const newMFDivRight = document.createElement("div");
    newMFDivRight.className = "row-item-div-right";

    if (leftLabel === "本文") {
      const contentTextarea = document.createElement("div");
      contentTextarea.className = "content-textarea";
      contentTextarea.textContent = mForm_data["content"] || "";

      const mForm_button = document.createElement("input");
      mForm_button.type = "hidden";
      mForm_button.className = "textarea-value";
      mForm_button.value = mForm_data["content"] || "";

      newMFDivRight.append(contentTextarea, mForm_button);
    } else if (leftLabel === "業種") {
      rightLabels.forEach((label, index) => {
        if(index == 1){
          const m_Form_span_label1 = document.createElement("span");
          m_Form_span_label1.className="m-form-span-label";
          m_Form_span_label1.innerText="部署名"
          newMFDivRight.appendChild(m_Form_span_label1);
        }
        if(index == 2){
          const m_Form_span_label2 = document.createElement("span");
          m_Form_span_label2.className="m-form-span-label";
          m_Form_span_label2.innerText="役職名"
          newMFDivRight.appendChild(m_Form_span_label2);
        }
        const mForm_button = document.createElement("input");
        mForm_button.type = "button";
        mForm_button.className = buttonClass;
        mForm_button.value = mForm_data[label] || "";
        newMFDivRight.appendChild(mForm_button);
      });
    }
    else if (leftLabel === "Webサイト") {
      rightLabels.forEach((label, index) => {
        // if(index == 2){
        //   const m_Form_span_label1 = document.createElement("span");
        //   m_Form_span_label1.className="m-form-span-label";
        //   m_Form_span_label1.innerText="Webサイト"
        //   newMFDivRight.appendChild(m_Form_span_label1);
        // }
        if(index == 1){
          const m_Form_span_label2 = document.createElement("span");
          m_Form_span_label2.className="m-form-span-label";
          m_Form_span_label2.innerText="問い合わせ件名"
          newMFDivRight.appendChild(m_Form_span_label2);
        }
        const mForm_button = document.createElement("input");
        mForm_button.type = "button";
        mForm_button.className = buttonClass;
        mForm_button.value = mForm_data[label] || "";
        newMFDivRight.appendChild(mForm_button);
      });
    }
     else {
      rightLabels.forEach((label) => {
        const mForm_button = document.createElement("input");
        mForm_button.type = "button";
        mForm_button.className = buttonClass;
        mForm_button.value = mForm_data[label] || "";
        newMFDivRight.appendChild(mForm_button);
      });
    }

    newMFDiv.append(newMFDivLeft, newMFDivRight);
    return newMFDiv;
  };

  const createModal = (contentDivs, infoTableHtml, resultOptionsHtml, closeAction) => {
    const mMFModal = document.createElement("div");
    mMFModal.className = "MFModal";
    mMFModal.id = "MFModal";

    const mForm_content = document.createElement("div");
    mForm_content.className = "MFModal-content";
    mForm_content.id = "mformMFDiv";

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const closeContainer = document.createElement("div");
    closeContainer.className = "close-container";

    const crossMFModal = document.createElement("span");
    crossMFModal.className = "MFclose";
    crossMFModal.id = "mMFclose";
    crossMFModal.innerHTML = "&times;";

    const infoTableHtmlTable = document.createElement("table");
    infoTableHtmlTable.innerHTML = infoTableHtml;
    infoTableHtmlTable.classList.add('ResultInfo');
    crossMFModal.onclick = closeAction;

    closeContainer.appendChild(crossMFModal);
    buttonContainer.appendChild(infoTableHtmlTable);
    buttonContainer.appendChild(closeContainer);
    mForm_content.appendChild(buttonContainer);

    contentDivs.forEach((div) => mForm_content.appendChild(div));
    mMFModal.appendChild(mForm_content);

    document.body.appendChild(mMFModal);
  };
  const mForm_data = data;
  data.customer_id = data.customer_id || '-';
  data.customer_option = data.customer_option || 'その他NG';
  data.contact_url = data.contact_url || '-';
  if (data.contact_url != "-") {
    data.contact_url = new URL(data.contact_url).hostname
  }
  data.company_name = data.company_name || '-';
  let infoTableHtml = '';
  if (data.customer_id === '-') {
    infoTableHtml = `
      <thead><tr><th>顧客ID</th><th>企業名</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td colspan="2"><input type="text" id="ref_client_id_1"></td><td><button id="ref_client_btn_1">取得</button></td></tr>
      </tbody>`;
  } else {
    infoTableHtml = `
      <thead><tr><th>顧客ID</th><th>企業名</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td id="customer_id_td">${data.customer_id}</td><td>${data.company_name}</td><td>${data.contact_url}</td></tr>
      </tbody>`;
  }
  const contentDivs = [
    createElementDiv("名前", mForm_data, ["full_name", "last_name", "first_name", "full_hira", "last_hira", "first_hira"], "mformButton"),
    createElementDiv("会社名", mForm_data, ["company", "company_hira"], "mformButton"),
    createElementDiv("住所", mForm_data, ["post", "post1", "post2", "address", "city", "street", "building", "full_address"], "mformButton"),
    createElementDiv("連絡先", mForm_data, ["email", "tel", "tel1", "tel2", "tel3"], "mformButton"),
    createElementDiv("業種", mForm_data, ["business", "department", "job"], "mformButton"),
    // createElementDiv("部署名・役職名", mForm_data, ["department", "job"], "mformButton"),
    createElementDiv("Webサイト", mForm_data, ["website", "service_fee"], "mformButton"),
    // createElementDiv("問い合わせ件名", mForm_data, ["service_fee"], "mformButton"),
    createElementDiv("本文", mForm_data, ["content"], "mformButton"),
  ];
  console.log("displayModal----", closeAction);
  createModal(contentDivs, infoTableHtml, "", closeAction);
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        // console.log("Text copied to clipboard:", text);
      }).catch((err) => {
        console.error("Failed to copy text: ", err);
      });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  }
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      // console.log("Text copied to clipboard using fallback method");
    } catch (err) {
      console.error("Fallback: Unable to copy", err);
    }
    document.body.removeChild(textArea);
  }
  const buttons = document.querySelectorAll('.mformButton, .content-textarea');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      let textToCopy: string;
      if (button instanceof HTMLTextAreaElement || button instanceof HTMLInputElement) {
        textToCopy = button.value;
      } else if (button instanceof HTMLElement) {
        textToCopy = button.innerText;
      } else {
        textToCopy = '';
      }
      // navigator.clipboard.writeText(textToCopy)
      //   .then(() => {
      //     console.log('Text copied to clipboard:', textToCopy);
      //   })
      //   .catch((err) => {
      //     console.error('Failed to copy text: ', err);
      //   });
      copyText(textToCopy);
      closeAction();
      document.body.focus();
      chrome.storage.local.get(['checkboxState'], function (result) {
        const checkboxState = result.checkboxState === 'true';
        if (checkboxState) {
          if (selected_input_element) {
            selected_input_element.value = textToCopy;
          }
        }
      });
    });
  });

  document.getElementById('ref_client_btn_1')?.addEventListener('click', async () => {
    const sel_id = (document.getElementById('ref_client_id_1') as HTMLInputElement).value;
    console.log(sel_id);
    try {
      const host_url = "https://autofill.robosell.jp/";
      const mForm_CURRENT_DOMAIN = window.location.hostname;
      const user_api_key = localStorage.getItem("user_api_key");
      console.log(localStorage.getItem("user_api_key"));
      try {
        const response = await fetch(`${host_url}api/get_text_data?api_key=${user_api_key}&domain=${mForm_CURRENT_DOMAIN}&sel_id=${sel_id}`);
        const result = await response.json();

        if (result.type !== 'GetSuccess') {
          alert(result.message);
          return;
        }
        if (result.url.indexOf(mForm_CURRENT_DOMAIN) >= 0) {
          const contentTextarea = document.querySelector('.content-textarea');
          if (contentTextarea) {
            contentTextarea.textContent = result.message;
            (document.getElementById('mMFSendResultBtn') as HTMLButtonElement).disabled = false;
          }
          const url = new URL(result.url);
          const domain = url.hostname;
          const infoTableHtml = `
          <thead><tr><th>顧客ID</th><th>企業名</th><th>URL</th></tr></thead>
          <tbody>
            <tr><td id="customer_id_td">${result.customer_id}</td><td>${result.company_name}</td><td>${domain}</td></tr>
          </tbody>`;
          const cur_table = document.getElementById("mResultInfo");
          cur_table.innerHTML = infoTableHtml;
        } else {
          alert("顧客IDが違います。作業中にペジーの 該当する顧客IDを入力します。");
          return;
        }
        // 
      } catch (error) {
        console.error("エラー: ", error);
      }
    } catch (error) {
      alert('アップデート作業中です。完了次第、ご利用できます。\n作業を中断して今しばらくお待ちください。');
    }
  });
};

const ContentScript = () => {
  const displayFlagModal = (cur_element) => {
    chrome.storage.local.get(['checkboxState'], function (result) {
      const checkboxState = result.checkboxState === 'true';
      if (checkboxState) {
        chrome.storage.local.get(['modalData'], function (result) {
          const modalData = result.modalData;
          displayModal(modalData, () => {
            const modals = document.querySelectorAll('#MFModal');
            const lastModal = modals[modals.length - 1];
            lastModal.remove()
          });
          selected_input_element = cur_element
          const modals = document.querySelectorAll<HTMLDivElement>('#MFModal');
          const lastModal = modals[modals.length - 1];
          lastModal.style.display = 'block';
        });
      }
    });
  };


  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "AUTOFILL") {
        handleAutofill(message);
      }
      if (message.action === "MANUAL_COPY") {
        localStorage.setItem("user_api_key", message.user_api_key);
        localStorage.setItem("user_mana_id", message.user_mana_id);
        displayModal(message.data, () => {
          const modals = document.querySelectorAll('#MFModal');
          const lastModal = modals[modals.length - 1];
          lastModal.remove()
        });
        const modals = document.querySelectorAll<HTMLDivElement>('#MFModal');
        const lastModal = modals[modals.length - 1];
        lastModal.style.display = 'block';
      }
      if (message.action === "REGISTER_RESULT") {
        openResultModal(message.data);
        localStorage.setItem("user_api_key", message.user_api_key);
        localStorage.setItem("user_mana_id", message.user_mana_id);
      }
      sendResponse({ status: "Form data filled!" });
    });
  }, []);

  useEffect(() => {
    const inputElements = document.querySelectorAll('input, textarea');
    inputElements.forEach((element) => {
      element.addEventListener('dblclick', () => displayFlagModal(element));
    });
  }, []);
  return null;
};

export default ContentScript;