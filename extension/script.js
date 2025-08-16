let answers = document.getElementsByClassName('outcome');

let questions = document.querySelectorAll('.formulation');

const reviewBtn = document.createElement('button');
reviewBtn.textContent = 'Start Review';
reviewBtn.style.position = 'fixed';
reviewBtn.style.top = '20px';
reviewBtn.style.right = '20px';
reviewBtn.style.zIndex = '9999';
reviewBtn.style.padding = '10px 20px';
reviewBtn.style.fontSize = '16px';
document.body.appendChild(reviewBtn);

// Make reviewBtn draggable
let isDragging = false;
let dragStarted = false;
let offsetX, offsetY;
let dragJustEnded = false;

reviewBtn.addEventListener('mousedown', function (e) {
  isDragging = true;
  dragStarted = false;
  offsetX = e.clientX - reviewBtn.getBoundingClientRect().left;
  offsetY = e.clientY - reviewBtn.getBoundingClientRect().top;
  dragJustEnded = false;
});

document.addEventListener('mousemove', function (e) {
  if (isDragging) {
    // Only start drag if mouse moved enough
    if (
      !dragStarted &&
      (Math.abs(e.movementX) > 2 || Math.abs(e.movementY) > 2)
    ) {
      dragStarted = true;
      reviewBtn.style.cursor = 'grabbing';
    }
    if (dragStarted) {
      // Clamp position so button stays fully visible
      const btnWidth = reviewBtn.offsetWidth;
      const btnHeight = reviewBtn.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      // Clamp left and top
      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - btnWidth));
      newTop = Math.max(0, Math.min(newTop, viewportHeight - btnHeight));
      reviewBtn.style.left = newLeft + 'px';
      reviewBtn.style.top = newTop + 'px';
      reviewBtn.style.right = '';
    }
  }
});

document.addEventListener('mouseup', function () {
  if (isDragging) {
    isDragging = false;
    if (dragStarted) {
      reviewBtn.style.cursor = 'pointer';
      dragJustEnded = true;
    }
    dragStarted = false;
  }
});

reviewBtn.style.cursor = 'pointer';

let current = -1;

function highlightQuestion(idx) {
  questions.forEach((q) => (q.style.background = ''));
  if (questions[idx]) {
    questions[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    questions[idx].style.background = '#ffeeba';
  }
}

function getNextQuestionLabel() {
  return `Next Question ${current + 2}/${questions.length}`;
}

function prepare() {
  const checks = document.getElementsByClassName(
    'icon fa fa-check text-success fa-fw '
  );
  Array.from(checks).forEach((check) => (check.style.display = 'none'));

  const selections = document.querySelectorAll(
    'input[type=radio][checked=checked]'
  );
  Array.from(selections).forEach((sel) => sel.removeAttribute('checked'));

  Array.from(answers).forEach((ans) => (ans.style.display = 'none'));
}

reviewBtn.addEventListener('click', function (e) {
  if (dragJustEnded) {
    // Prevent click if mouseup just ended a drag
    e.preventDefault();
    dragJustEnded = false;
    return;
  }
  if (reviewBtn.textContent === 'Start Review') {
    prepare();
    reviewBtn.textContent = getNextQuestionLabel();

  }  else if (reviewBtn.textContent === 'Finish Review') {
    questions[current].style.background = '';
    current = -1;
    reviewBtn.textContent = 'Start Review';

  } else if (reviewBtn.textContent.includes('Next Question')) {
    if (current !== -1) questions[current].style.background = ''; // Clear previous question highlight
    current++;
    highlightQuestion(current);
    reviewBtn.textContent = `Show Answer ${current + 1}/${questions.length}`;

  } else if (reviewBtn.textContent.includes('Show Answer')) {
    if (answers[current]) answers[current].style.display = '';
    if (current + 1 < questions.length) {
      reviewBtn.textContent = getNextQuestionLabel();
    } else {
      reviewBtn.textContent = 'Finish Review';
    }
  } 
});
