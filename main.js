const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const soundCorrect = new Audio("./sound/correct.mp3");
const soundWrong = new Audio("./sound/wrong.mp3");
const soundClick = new Audio("./sound/click.mp3");
const soundCheer = new Audio("./sound/cheer.mp3");
const soundSad = new Audio("./sound/sad.mp3");
// bien phan modal hien thi loi giai
const explanationLink = $("#explanation-link");
const explanationModal = $("#explanation-modal");
const explanationImage = $("#explanation-image");

// fetch data from bienbaoData.json  BIENBAO DATA
let startIndex = 0; //không được xóa vì liên quan đến fetch
let endIndex = 10; //không được xóa vì liên quan đến fetch
let currentFullData = []; // sẽ là data1 hoặc data2 tùy loại đề
let currentQuestionSet = []; // mảng 10 câu hiện tại

let data1 = [];
let dataOfQuestionSet = [];
let data2 = [];
let dataQdc = [];
Promise.all([
  fetch("./bienbaoData.json").then((res) => res.json()),
  fetch("./quidinhchungData.json").then((res) => res.json()),
])
  .then(([result1, result2]) => {
    data1 = result1;
    dataOfQuestionSet = data1.slice(startIndex, endIndex);

    data2 = result2;
    dataQdc = data2.slice(startIndex, endIndex);

    main(); // gọi một lần duy nhất sau khi cả hai đã sẵn sàng
  })
  .catch((err) => {
    console.error("Lỗi khi load dữ liệu:", err);
  });
//----------------------------------------------------------------------------------
// các biến ân hiện giao diện
const listQuestionBlock = $(".list-question-block");
const let100ToPass = $(".thong-bao-100-de-pass-bo-de");

const mainBlock = $(".mainBlock");
const bienBao = $(".bienBao");
const qdc = $(".qdc");
const diemLiet = $(".diemLiet");

//  back lại menu
const menu = $(".menu");
console.log(menu);

menu.addEventListener("click", backMenu);

// function main  // giao dien ban dau nhat
function main() {
  blockAnswer.classList.add("hide");
  blockQuestion.classList.add("hide");
  nextBtn.classList.add("hide");
  alertCorrectOrIncorrect.classList.add("hide");
  blockResult.classList.add("hide");
  showResultBtn.classList.add("hide");
  let100ToPass.classList.add("hide");
  menu.style.display = "none";
  // bien bao
  bienBao.addEventListener("click", () => {
    bienBao.classList.add("hide");
    qdc.classList.add("hide");
    diemLiet.classList.add("hide");
    start(data1); // dùng data1 cho biển báo
  });

  qdc.addEventListener("click", () => {
    bienBao.classList.add("hide");
    qdc.classList.add("hide");
    diemLiet.classList.add("hide");
    start(data2); // dùng data2 cho quy định chung
  });

  // diem liet chua co
  diemLiet.addEventListener("abc", () => {
    bienBao.classList.add("hide");
    qdc.classList.add("hide");
    diemLiet.classList.add("hide");
  });
}
//  back lại menu

function backMenu() {
  listQuestionBlock.innerHTML = ``;
  explanationLink.classList.add("hide");
  alertYouChoose.classList.add("hide");
  main();
  bienBao.classList.remove("hide");
  qdc.classList.remove("hide");
  diemLiet.classList.remove("hide");
}

function createNumberOderQuestionSet(data) {
  let num = Math.ceil(data.length / 10); // luôn chuẩn rồi. ko được chỉnh, cứ thêm 10 câu hỏi thì tạo 1 bộ đề
  for (let i = 0; i < num; i++) {
    listQuestionBlock.innerHTML += `<span class="list-question">Đề số ${
      i + 1
    }</span>`;
  }
}

// --------------------------------------------------------------------
// function tăng startIndex và endIndex lên mỗi lần 10
// function raiseStartEndIndex(num, data, arr) {
//   startIndex = num * 10;
//   endIndex = startIndex + 10;
//   return arr.slice(startIndex, endIndex);
// }

//  tra loi xong quay lai man hinh chinh
const chooseListQuestionBtn = $(".btn-chooseListQuestion"); // nút chọn đề

chooseListQuestionBtn.addEventListener("click", () => {
  soundClick.play();
  start(currentFullData); // ✅ dùng biến đang lưu loại đề hiện tại
  explanationLink.classList.add("hide");
});

// -------------------------------------------------------------------------

// -----------------------------------------------------------------------------------
// function man hinh chinh (start())
const blockAnswer = $(".block-answer");

function start(fullData) {
  currentFullData = fullData;
  currentQuestionSet = fullData.slice(startIndex, endIndex);
  listQuestionBlock.innerHTML = "";
  let100ToPass.classList.remove("hide");
  menu.style.display = "block";
  createNumberOderQuestionSet(fullData);

  const listQuestion = $$(".list-question");
  const result2 = JSON.parse(localStorage.getItem("pass")) || {};

  listQuestion.forEach((question, index) => {
    question.addEventListener("click", () => {
      let100ToPass.classList.add("hide");
      soundClick.play();
      startIndex = index * 10;
      endIndex = startIndex + 10;
      currentQuestionSet = currentFullData.slice(startIndex, endIndex);
      init(begin); // dùng currentQuestionSet trong init()
      localStorage.setItem("selected index", JSON.stringify(index));
      blockAnswer.classList.remove("hide");
      blockQuestion.classList.remove("hide");
      nextBtn.classList.add("hide");
      alertCorrectOrIncorrect.classList.add("hide");
      blockChoice.forEach((choice) => {
        choice.classList.remove("hide");
      });
    });

    // xử lý màu sắc đề đã làm
    if (result2.hasOwnProperty(index)) {
      if (result2[index] === 100) {
        question.style.color = "#018ca5ff";
        question.innerHTML = `✓ Đề số ${index + 1}`;
      } else {
        question.style.color = "#ff6b3eff";
        question.innerHTML = `✗ Đề số ${index + 1}`;
      }
    } else {
      question.style.color = "";
      question.innerHTML = `Đề số ${index + 1}`;
    }
  });

  begin = 0;
  score = 0;
  isClick = false;
  reset();

  blockAnswer.classList.add("hide");
  blockQuestion.classList.add("hide");
  nextBtn.classList.add("hide");
  alertCorrectOrIncorrect.classList.add("hide");
  blockResult.classList.add("hide");
  showResultBtn.classList.add("hide");
}

// ------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------
const blockQuestion = $(".block-question");
const blockChoice = $$(".choice");
const showResultBtn = $("#show-result");
const blockResult = $(".block-result");
const nextBtn = $("#next");
let begin = 0; //khoi tao luot cau "hoi dau tien

const alertCorrectOrIncorrect = $("#alert-correct-or-incorrect");

const letters = [`A`, `B`, `C`, `D`];
const imgElement = $(".image");
// -------------------------------------------------------------------
// function init

function init(begin) {
  listQuestionBlock.innerHTML = ""; // ẩn danh sách đề
  blockQuestion.scrollIntoView(true);
  const currentQuestion = currentQuestionSet[begin];

  blockQuestion.innerText = `Câu số ${currentQuestion.numberOrder}: ${currentQuestion.question}`;
  imgElement.src = currentQuestion.urlImage;
  blockQuestion.appendChild(imgElement);

  blockChoice.forEach((choice, index) => {
    const answerText = currentQuestion.answers[index]?.answer?.trim();

    if (answerText) {
      choice.style.display = "flex"; // hoặc "block" tùy theo CSS
      choice.innerHTML = `
        <div class="letter">${letters[index]}</div>
        <div class="text-choice">${answerText}</div>
      `;
    } else {
      choice.style.display = "none"; // ẩn nếu không có nội dung
    }
  });

  showResultBtn.classList.add("hide");
  blockResult.classList.add("hide");
  nextBtn.classList.add("hide");
  alertCorrectOrIncorrect.classList.add("hide");
}
// ----------------------------------------------------------------------------
// reset
function reset() {
  blockChoice.forEach((choice) => {
    choice.classList.remove("green-correct", "red-incorrect");
    isClick = false;
  });
}

// function next question

function next() {
  soundClick.play();
  // Ẩn bằng fade
  blockQuestion.classList.remove("visible");
  blockAnswer.classList.remove("visible");
  blockQuestion.classList.add("fade");
  blockAnswer.classList.add("fade");
  setTimeout(() => {
    begin++;
    init(begin);
    reset();

    // Hiện lại bằng fade-in
    blockQuestion.classList.remove("fade");
    blockAnswer.classList.remove("fade");
    blockQuestion.classList.add("visible");
    blockAnswer.classList.add("visible");

    alertYouChoose.classList.add("hide");
  }, 400);
  explanationLink.classList.add("hide");
}
nextBtn.addEventListener("click", next);
//----------------------------------------------------------------------------------
// function check answer correct
let score = 0; // count score from 0
let isClick = false;
const alertYouChoose = $(".alert-you-choose");

blockChoice.forEach((choice, index) => {
  choice.addEventListener("click", () => {
    if (isClick) return;
    isClick = true;

    alertYouChoose.innerText = `Bạn chọn ${letters[index]}`;
    alertYouChoose.classList.remove("hide");

    const currentQuestion = currentQuestionSet[begin];

    if (currentQuestion.answers[index].correct === true) {
      soundCorrect.play();
      choice.classList.add("green-correct");
      alertCorrectOrIncorrect.innerText = " Đúng!";
      alertCorrectOrIncorrect.style.color = "#02fa23ff";
      alertCorrectOrIncorrect.classList.remove("hide");
      nextBtn.classList.remove("hide");
      score++;
      alertCorrectOrIncorrect.scrollIntoView(true);
    } else {
      choice.classList.add("red-incorrect");
      alertCorrectOrIncorrect.innerText = `Sai!`;
      alertCorrectOrIncorrect.style.color = "#ff9100ff";
      alertCorrectOrIncorrect.classList.remove("hide");
      nextBtn.classList.remove("hide");
      soundWrong.play();

      if ("vibrate" in navigator) {
        navigator.vibrate(100);
      }

      blockChoice.forEach((otherChoice, otherIndex) => {
        if (currentQuestion.answers[otherIndex].correct === true) {
          otherChoice.classList.add("green-correct");
        }
      });

      alertCorrectOrIncorrect.scrollIntoView(true);
    }

    if (begin === currentQuestionSet.length - 1) {
      showResultBtn.classList.remove("hide");
      nextBtn.classList.add("hide");
    }

    explanationLink.classList.remove("hide");
    explanationLink.onclick = () => {
      soundClick.play();
      explanationImage.src = currentQuestion.explanation;
      explanationModal.classList.remove("hide");
    };

    explanationModal.addEventListener("click", () => {
      explanationModal.classList.add("hide");
    });
  });
});

// --------------------------------------------------------------------

function showResult() {
  blockQuestion.classList.add("hide");
  explanationLink.classList.add("hide");
  blockChoice.forEach((choice) => {
    choice.classList.add("hide");
    choice.style.display = "none"; // đảm bảo ẩn hoàn toàn
  });
  alertCorrectOrIncorrect.classList.add("hide");
  showResultBtn.classList.add("hide");
  blockResult.classList.remove("hide");
  showScore();
  alertYouChoose.classList.add("hide");
}

showResultBtn.addEventListener("click", showResult);

// --------------------------------------------------------------------

const closeAgainBtn = $(".btn-close");

closeAgainBtn.addEventListener("click", () => {
  soundClick.play();
  begin = 0;
  isClick = false;
  score = 0;
  blockResult.classList.add("hide");

  blockQuestion.classList.remove("hide");
  blockChoice.forEach((choice) => choice.classList.remove("hide"));
  alertCorrectOrIncorrect.classList.remove("hide");
  showResultBtn.classList.remove("hide");

  init(begin);
  reset();
});

// --------------------------------------------------------------------

let percentScore = 0;
const scoreBlock = $("#score");
const paraScore = $(".para-score");
const conclusionBlock = $(".conclusion");

function showScore() {
  percentScore = Math.round((score / currentQuestionSet.length) * 100);
  scoreBlock.innerText = `${percentScore}%`;
  scoreBlock.style.color = percentScore == 100 ? "#3967e6ff" : "red";
  paraScore.innerText = `Bạn đã trả lời đúng ${score} trên ${currentQuestionSet.length} câu hỏi`;

  const selectedIndex = JSON.parse(localStorage.getItem("selected index"));
  let allResults = JSON.parse(localStorage.getItem("pass")) || {};
  allResults[selectedIndex] = percentScore;
  localStorage.setItem("pass", JSON.stringify(allResults));

  if (percentScore === 100) {
    soundCheer.play();
  } else {
    soundSad.play();
  }
}

// --------------------------------------------------------------------------
//  pháo hoa
//------------------------------------------------------------------------------------
//
