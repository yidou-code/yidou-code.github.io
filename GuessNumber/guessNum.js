class GuessNumberGame {
  constructor() {
    this.answer = this.generateRandomNumber();
    this.input = document.getElementById('input');
    this.output = document.getElementById('output');
    this.result = document.getElementById('result');
    this.startButton = document.getElementById('startButton');
    this.guessButton = document.getElementById('guessButton');
    this.hobbySection = document.getElementById('hobbySection');
    this.confirmButton = document.getElementById('confirmHobby');
    this.hobbyCards = document.querySelectorAll('.hobby-card');
    this.selectedHobby = null;
    this.hobbyConfirmed = false;
    this.wrongGuessCount = 0;
    this.isAdmin = false; // 新增：管理员模式标识

    this.bindEvents();
    this.resetGame();

    // 模态框相关元素
    this.modal = document.getElementById('customModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalMessage = document.getElementById('modalMessage');
    this.modalConfirm = document.getElementById('modalConfirm');
    this.modalCancel = document.getElementById('modalCancel');
    this.closeModal = document.querySelector('.close');
    this.nextStepSection = document.getElementById('nextStepSection');
    this.nextStepTitle = document.getElementById('nextStepTitle');
    this.nextStepContent = document.getElementById('nextStepContent');
    this.backToGame = document.getElementById('backToGame');
    
    // 绑定模态框事件
    this.bindModalEvents();

    // 密钥验证相关
    this.adminKey = document.getElementById('adminKey');
    this.verifyKey = document.getElementById('verifyKey');
    this.keyMessage = document.getElementById('keyMessage');
    this.correctKey = "123456"; // 示例密钥
    
    // 绑定密钥验证事件
    this.verifyKey.addEventListener('click', () => this.verifyAdminKey());

    this.gender = null;
    this.originalModalCancelText = this.modalCancel.textContent; // 保存原始取消按钮文本
  }

  // 重置并隐藏所有额外区域
  resetAndHideAllSections() {
    this.resetGame();
    this.hideHobbySection();
    this.hideNextStepSection();
    this.hideModal();
    
    // 重置游戏控制按钮状态
    this.startButton.disabled = false;
    this.guessButton.disabled = true;
    this.input.value = '';
    this.result.value = '';
    this.output.value = '';
    
    // 重置兴趣爱好和管理员状态
    this.selectedHobby = null;
    this.hobbyConfirmed = false;
    this.wrongGuessCount = 0;
    this.isAdmin = false;
    this.gender = null;
    
    // 重置管理员密钥状态
    this.adminKey.value = '';
    this.keyMessage.classList.add('hidden');
    
    // 重置模态框按钮文本
    this.modalCancel.textContent = this.originalModalCancelText;
    
    // 重置所有hobby卡片样式
    this.hobbyCards.forEach(card => {
      card.classList.remove('selected');
    });
  }

  // 验证管理员密钥
  verifyAdminKey() {
    const inputKey = this.adminKey.value.trim();
    
    if (inputKey === "") {
      this.showKeyMessage("请输入密钥", "error");
      return;
    }
    
    if (inputKey === this.correctKey) {
      this.showKeyMessage("验证成功！正在加载隐藏内容...", "success");
      this.isAdmin = true; // 标记为管理员模式
      
      setTimeout(() => {
        this.showHiddenContent();
        this.adminKey.value = "";
        setTimeout(() => {
          this.keyMessage.classList.add('hidden');
        }, 300);
      }, 1000);
    } else {
      this.showKeyMessage("密钥错误，请重新输入", "error");
    }
  }

  // 显示密钥验证消息
  showKeyMessage(message, type = "normal") {
    this.keyMessage.textContent = message;
    this.keyMessage.className = type === "error" ? "key-message error" : "key-message success";
    this.keyMessage.classList.remove('hidden');
  }

  // 显示隐藏内容
  showHiddenContent() {
    // 隐藏游戏输入区，显示兴趣爱好选择
    this.startButton.classList.add('hidden');
    this.guessButton.classList.add('hidden');
    this.input.classList.add('hidden');
    this.result.classList.add('hidden');
    this.output.classList.add('hidden');
    
    // 显示兴趣爱好和下一步区域
    this.hobbySection.classList.remove('hidden');
    this.nextStepSection.classList.remove('hidden');
    
    // 如果是管理员模式，直接显示兴趣爱好选择
    if (this.isAdmin) {
      this.showNextStepSection(
        "管理员模式", 
        `<p>欢迎管理员！您可以直接选择兴趣爱好。</p>`
      );
    }
  }

  // 生成随机数
  generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  // 绑定事件
  bindEvents() {
    this.startButton.addEventListener('click', () => this.startGame());
    this.guessButton.addEventListener('click', () => this.makeGuess());
    
    this.hobbyCards.forEach(card => {
      card.addEventListener('click', () => this.selectHobby(card));
    });
    
    this.confirmButton.addEventListener('click', () => {
      if (!this.confirmButton.classList.contains('disabled')) {
        this.confirmHobbySelection();
      }
    });
    
    // 键盘事件
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target === this.input) {
        this.makeGuess();
      } else if (event.key === ' ') {
        this.startGame();
        this.input.focus();
      }
    });
  }

  // 开始游戏
  startGame() {
    this.answer = this.generateRandomNumber();
    this.resetGame();
    this.startButton.disabled = true;
    this.guessButton.disabled = false;
    this.result.value = '请输入数字';
    this.result.className = 'normal';
  }

  // 猜数字
  makeGuess() {
    const inputValue = this.input.value;
    if (!this.isValidInput(inputValue)) {
      this.result.value = '请输入一个1 - 100之间的有效数字';
      this.result.className = 'normal';
      return;
    }
    
    const guessedNumber = parseInt(inputValue);
    this.output.value = inputValue + '\n' + this.output.value;
    
    if (guessedNumber === this.answer) {
      this.result.value = `恭喜你猜对了，答案就是${this.answer}!`;
      this.result.className = 'success';
      this.startButton.disabled = false;
      this.guessButton.disabled = true;
      
      // 显示兴趣爱好选择区域
      if (this.wrongGuessCount <= 10) {
        this.showHobbySection();
      }
    } else {
      this.result.value = guessedNumber > this.answer ? '你猜的数字太大了' : '你猜的数字太小了';
      this.result.className = 'normal';
      this.wrongGuessCount++;
    }
  }

  // 验证输入有效性
  isValidInput(value) {
    return !isNaN(value) && value >= 1 && value <= 100;
  }

  // 重置游戏
  resetGame() {
    this.answer = this.generateRandomNumber();
    this.input.value = '';
    this.output.value = '';
    this.result.value = '';
    this.result.className = 'normal';
    this.wrongGuessCount = 0;
  }

  // 显示兴趣爱好区域
  showHobbySection() {
    this.hobbySection.classList.remove('hidden');
    this.resetHobbySelection();
  }

  // 隐藏兴趣爱好区域
  hideHobbySection() {
    this.hobbySection.classList.add('hidden');
  }

  // 选择兴趣爱好
  selectHobby(card) {
    if (this.hobbyConfirmed) return;
    
    this.resetHobbySelection();
    card.classList.add('selected');
    this.selectedHobby = card.getAttribute('data-hobby');
    this.confirmButton.classList.remove('disabled');
  }

  // 重置兴趣爱好选择
  resetHobbySelection() {
    this.hobbyCards.forEach(card => {
      card.classList.remove('selected');
    });
    this.selectedHobby = null;
    this.confirmButton.classList.add('disabled');
  }

  // 绑定模态框事件
  bindModalEvents() {
    this.closeModal.addEventListener('click', () => {
      this.hideModal();
      // 确保取消按钮文本恢复
      this.modalCancel.textContent = this.originalModalCancelText;
    });
    
    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.hideModal();
        // 确保取消按钮文本恢复
        this.modalCancel.textContent = this.originalModalCancelText;
      }
    });
    
    this.modalConfirm.addEventListener('click', () => {
      this.hideModal();
      if (this.modalCallback) {
        this.modalCallback();
        this.modalCallback = null;
      }
      // 确保取消按钮文本恢复
      this.modalCancel.textContent = this.originalModalCancelText;
    });
    
    this.modalCancel.addEventListener('click', () => {
      this.hideModal();
      if (this.modalCancelCallback) {
        this.modalCancelCallback();
        this.modalCancelCallback = null;
      }
      // 确保取消按钮文本恢复
      this.modalCancel.textContent = this.originalModalCancelText;
    });
    
    // 返回游戏按钮
    this.backToGame.addEventListener('click', () => {
      this.resetAndHideAllSections();
    });
  }
  
  // 显示自定义模态框
  showModal(title, message, confirmText = "确认", callback = null, showCancel = false, cancelCallback = null) {
    this.modalTitle.textContent = title;
    this.modalMessage.textContent = message;
    this.modalConfirm.textContent = confirmText;
    
    // 显示或隐藏取消按钮
    this.modalCancel.classList.toggle('hidden', !showCancel);
    
    // 存储回调函数
    this.modalCallback = callback;
    this.modalCancelCallback = cancelCallback;
    
    // 显示模态框
    this.modal.classList.remove('hidden');
  }
  
  // 隐藏模态框
  hideModal() {
    this.modal.classList.add('hidden');
  }
  
  // 显示下一步操作区域
  showNextStepSection(title, content) {
    this.nextStepTitle.textContent = title;
    this.nextStepContent.innerHTML = content;
    this.nextStepSection.classList.remove('hidden');
  }
  
  // 隐藏下一步操作区域
  hideNextStepSection() {
    this.nextStepSection.classList.add('hidden');
  }
  
  // 确认兴趣爱好选择
  confirmHobbySelection() {
    if (!this.selectedHobby) return;
    
    this.showModal(
      "确认选择", 
      `你选择了: ${this.selectedHobby}。点击确认继续。`,
      "确认",
      () => {
        this.handleHobbyAction(this.selectedHobby);
        this.resetHobbySelection();
        this.hideHobbySection();
      },
      true, 
      () => {
        this.resetHobbySelection();
      }
    );
  }
  
  // 处理兴趣爱好操作
  handleHobbyAction(hobby) {
    switch(hobby) {
      case '音乐':
        this.showNextStepSection(
          "音乐推荐", 
          `<p>原来你也喜欢听歌，这是我钟爱的一首歌：</p>
          <p><strong>《Wind Hill》—— 羽肿</strong></p>
          <p>希望你会喜欢！</p>`
        );
        break;
      case '运动':
        this.showNextStepSection(
          "运动挑战", 
          `<p>运动有益健康！这里有一个适合你的健身挑战：</p>
          <p><strong>30天平板支撑挑战</strong></p>
          <p>每天增加10秒，坚持一个月！</p>`
        );
        break;
      case '绘画':
        this.showNextStepSection(
          "绘画挑战", 
          `<p>哈哈，想不到吧，既然选了就别跑了</p>
          <p>试试这个简单的绘画练习：</p>
          <p><strong>画一个你最喜欢的动物</strong></p>
          <p>不需要很完美，只要享受过程！记得发给我，嘿嘿！</p>`
        );
        break;
      case '旅行':
        this.showNextStepSection(
          "旅行图片", 
          `<p>旅行可以开阔眼界！看看吧，希望带给你一个好心情：</p>
          <img src="img/风景.jpg" alt="风景" class="anime-image"> 
          `
        );
        break;
      case '游戏':
        this.showNextStepSection(
          "游戏伙伴", 
          `<p>游戏是一种很好的放松方式！看来想打游戏了吗</p>
          <p>想玩什么游戏呢，我可以陪你打一把呢</p>
          <p><strong>告诉我，我们可以一起玩！</strong></p>`
        );
        break;
      

// 修改后的动漫分支代码
case '动漫':
this.showNextStepSection(
  "动漫", 
  `<p>你也喜欢看动漫啊，呢很不错了，我更喜欢二次元。嘿嘿</p>
   <img src="./img/02.jpg" alt="男"> `
);

    }
  }
}

new GuessNumberGame();