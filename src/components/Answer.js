const {default: AlmostCorrectAnswer} = require('./AlmostCorrectAnswer');
const {default: CorrectAnswer} = require('./CorrectAnswer');
const {default: WrongAnswer} = require('./WrongAnswer');

const Answer = ({answer}) => {
  switch (answer.status) {
    case 'almost':
      return <AlmostCorrectAnswer answer={answer} />;
    case 'correct':
      return <CorrectAnswer answer={answer} />;
    default:
      return <WrongAnswer answer={answer} />;
  }
};

export default Answer;
