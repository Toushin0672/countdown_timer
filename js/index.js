var timer   = document.getElementById('timer'); //タイマーの表示部分
var hour    = document.getElementById('hour'); //"時"ボタン
var min     = document.getElementById('min'); //"分"ボタン
var sec     = document.getElementById('sec'); //"秒"ボタン
var reset   = document.getElementById('reset'); //タイマーのリセットボタン
var start   = document.getElementById('start'); //タイマーの開始ボタン
var slider_volume = document.getElementById("volume");

const bgm = new Audio('./HeavenAndHell.wav');
bgm.loop = true;
bgm.volume = slider_volume.value;
const se  = new Audio('./explosion.mp3'); 

//スタートボタンを押した時の時間を入れる変数
var startTime;

//残り時間を計算するための変数
var timeLeft;

//現在時刻と表示形式を合わせる。 *1000
var timeToCountDown = 0;

//clearTimeoutメソッドを使いたいので、その時の為に変数定義
var timerId;

//カウントダウンの状態を管理できるようにする
var isRunning = false;

// **日本時間との時差（ミリ秒）**
var timeZoneOffset = 9 * 60 * 60 * 1000;


// 残り時間を表示するために、ミリ秒を渡すと、分や秒に直してくれる関数
function updateTimer(t){
    // 引数として渡されたtでデータオブジェクトを作りたいので変数dという変数名で作ってみる
    var d = new Date(t);
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    h = ('0' + h).slice(-2);
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);
    timer.textContent = h-9 + ':' + m + ':' + s;
  
    // タイマーをタブにも表示する
    var title = timer.textContent = (h-9) + ':' + m + ':' + s;
    document.title = title;

    return h;
}

// カウントダウン処理
function countDown(e) {
    timerId = setTimeout(function () {
      // 残り時間 = カウントされる時間 - 現在時刻
      timeLeft = timeToCountDown - (Date.now() - startTime);
  
      // 残り時間が0になった時の処理
      if (timeLeft < 0) {
        bgm.pause();
        bgm.currentTime = 0;
        if(e != 'start'){
          se.volume = bgm.volume;
          se.play();
        }
        isRunning = false;
        start.textContent = 'スタート';
        clearTimeout(timerId);
        timeLeft = 0;
        timeToCountDown = 0;
        updateTimer(timeLeft);
  
        return;
      }
  
      // カウントダウンを再帰的に呼び出すために記述
      updateTimer(timeLeft);
      countDown();
    }, 10);
  }

//スタートボタンを押した時の処理
function b_start(){
    if(isRunning === false){
        isRunning = true;
        start.textContent = 'ストップ';
        startTime = Date.now();

        countDown('start');
        bgm.play();
    }else {
        bgm.pause();
        isRunning = false;
        start.textContent = 'スタート';
        timeToCountDown = timeLeft;
        clearTimeout(timerId);
    }
};

// 時間ボタンを押した時の処理
function b_hour() {
    if (isRunning === true) {
      return;
    }
  
    timeToCountDown += 60 * 60 * 1000;
    if (timeToCountDown >= 4 * 60 * 60 * 1000) {
      timeToCountDown = 0;
    }
  
    updateTimer(timeToCountDown);
}

// 分ボタンを押した時の処理
function b_min() {
    if (isRunning === true) {
      return;
    }
  
    timeToCountDown += 60 * 1000;
    if (timeToCountDown > 60 * 60 * 1000) {
      timeToCountDown = 0;
    }
  
    updateTimer(timeToCountDown);
}

// 秒ボタンを押した時の処理
function b_sec() {
    if (isRunning === true) {
      return;
    }
  
    timeToCountDown += 1000;
    if (timeToCountDown >= 60 * 60 * 1000) {
      timeToCountDown = 0;
    }
  
    updateTimer(timeToCountDown);
}

function b_reset(){
    if(isRunning === true){
        return;
    }

    bgm.pause();
    bgm.currentTime = 0;
    timeToCountDown = 0;
    updateTimer(timeToCountDown);
}

slider_volume.addEventListener("input", e => {
  bgm.volume = slider_volume.value;
  document.getElementById('volume_value').innerHTML = (bgm.volume *100) + '%';
});
