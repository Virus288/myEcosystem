const generateTempId = (): string => {
  let id = '';
  for (let x = 0; x < 20; x++) {
    id += Math.round(Math.random() * 10);
  }

  return id;
};

export default generateTempId;
