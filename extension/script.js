const summaryTable = document.getElementsByClassName('quizreviewsummary');
const answers = document.getElementsByClassName('outcome');
const questions = document.getElementsByClassName('formulation');

const reviewBtn = document.createElement('button');
reviewBtn.textContent = 'Start Review';
reviewBtn.style.position = 'fixed';
reviewBtn.style.padding = '16px';
reviewBtn.style.backgroundColor = '#E90172';
reviewBtn.style.boxShadow = '0 .125rem .25rem rgba(0, 0, 0, .075)';
reviewBtn.style.color = '#fff';
reviewBtn.style.fontSize = '1rem';
reviewBtn.style.fontWeight = 'bold';
reviewBtn.style.lineHeight = '1.5';
reviewBtn.style.border = 'none';
reviewBtn.style.borderRadius = '28px';
reviewBtn.style.cursor = 'pointer';
reviewBtn.style.whiteSpace = 'nowrap';

function resetButtonLocation() {
  reviewBtn.style.top = '93px';
  reviewBtn.style.left = '50%';
  reviewBtn.style.transform = 'translateX(-50%) translateY(-50%)';
  reviewBtn.style.zIndex = '9999';
}
resetButtonLocation();

window.addEventListener('resize', resetButtonLocation);

document.body.appendChild(reviewBtn);

// Make reviewBtn draggable
let isDragging = false;
let dragStarted = false;
let dragJustEnded = false;

reviewBtn.addEventListener('mousedown', function (e) {
  isDragging = true;
  dragStarted = false;

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
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      let newLeft = e.clientX;
      let newTop = e.clientY;
      // Clamp left and top
      newLeft = Math.max(0, Math.min(newLeft, viewportWidth));
      newTop = Math.max(0, Math.min(newTop, viewportHeight));
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

let current = -1;

function highlightQuestion(idx) {
  Array.from(questions).forEach((q) => (q.style.background = ''));
  if (questions[idx]) {
    questions[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    questions[idx].style.background = '#ffeeba';
  }
}

function getNextQuestionLabel() {
  return `Next Question ${current + 2}/${questions.length}`;
}

function startReview() {
  const checks = document.querySelectorAll(
    'i[title="Incorrect"], i[title="Correct"]'
  );
  Array.from(checks).forEach((check) => (check.style.display = 'none'));

  const selections = document.querySelectorAll(
    'input[type=radio][checked=checked]'
  );
  Array.from(selections).forEach((sel) => sel.removeAttribute('checked'));

  Array.from(answers).forEach((ans) => (ans.style.display = 'none'));

  Array.from(summaryTable).forEach((sum) => (sum.style.visibility = 'hidden'));

  prependReviewingToSelfQuizHeaders();

  reviewBtn.textContent = getNextQuestionLabel();
}

function prependReviewingToSelfQuizHeaders() {
  document.querySelectorAll('h1').forEach((h1) => {
    if (h1.textContent.trim().startsWith('Self-Quiz')) {
      h1.textContent = 'Reviewing ' + h1.textContent;
    }
  });
}

function removeReviewingFromSelfQuizHeaders() {
  document.querySelectorAll('h1').forEach((h1) => {
    if (h1.textContent.trim().startsWith('Reviewing Self-Quiz')) {
      h1.textContent = h1.textContent.replace('Reviewing ', '');
    }
  });
}

function finishReview() {
  questions[current].style.background = '';
  current = -1;
  reviewBtn.textContent = 'Start Review';
  questions[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  Array.from(summaryTable).forEach((sum) => (sum.style.visibility = 'visible'));
  removeReviewingFromSelfQuizHeaders();
}

function nextQuestion() {
  if (current !== -1) questions[current].style.background = ''; // Clear previous question highlight
  current++;
  highlightQuestion(current);
  reviewBtn.textContent = `Show Answer ${current + 1}/${questions.length}`;
}

function showAnswer() {
  if (answers[current]) answers[current].style.display = '';
  if (current + 1 < questions.length) {
    reviewBtn.textContent = getNextQuestionLabel();
  } else {
    reviewBtn.textContent = 'Finish Review';
  }
}

reviewBtn.addEventListener('click', function (e) {
  if (dragJustEnded) {
    // Prevent click if mouseup just ended a drag
    e.preventDefault();
    dragJustEnded = false;
    return;
  }
  if (reviewBtn.textContent === 'Start Review') {
    startReview();
  } else if (reviewBtn.textContent === 'Finish Review') {
    finishReview();
  } else if (reviewBtn.textContent.includes('Next Question')) {
    nextQuestion();
  } else if (reviewBtn.textContent.includes('Show Answer')) {
    showAnswer();
  }
});
