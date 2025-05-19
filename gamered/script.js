document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.cool-btn').addEventListener('click', function() {
      const angerLevel = document.querySelector('.anger-level');
      const angerText = document.querySelector('.anger-text');
      
      let currentAnger = 100;
      const coolInterval = setInterval(() => {
          currentAnger -= 5;
          angerLevel.style.width = currentAnger + '%';
          angerText.textContent = `当前愤怒值: ${currentAnger}%`;
          
          if(currentAnger < 30) {
              angerLevel.style.background = 'linear-gradient(to right, #66ff99, #00cc66)';
          } else if(currentAnger < 60) {
              angerLevel.style.background = 'linear-gradient(to right, #ffcc66, #ff9933)';
          }
          
          if(currentAnger <= 0) {
              clearInterval(coolInterval);
              angerText.textContent = '冷静成功! 现在感觉好多了吧?,试一下小游戏';
              
              setTimeout(()=>{
                window.location.href = "index2.html"
              },3000)
          }
      }, 200);
  });
});