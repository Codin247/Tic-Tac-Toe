class GameViewer {
  static grid = {
    width: 3,
    height: 3,
  };
  static summaryToGrid(summary) {
    // given a summary of the game
    // return a list of grid cells with images for each frame
    const allFrames = [];
    try {
      const firstMove = summary[0];
      let firstFrame = [
        {
          x: parseInt(firstMove.move[0]),
          y: parseInt(firstMove.move[2]),
          imagePath: firstMove.player === 'X' ? 'x.png' : 'o.png',
        },
      ];
      if (firstMove.error) {
        firstFrame = [];
      }
      allFrames.push(firstFrame);
      for (let i = 1; i < summary.length; i++) {
        const previousFrame = allFrames[i - 1];
        const currentFrame = [...previousFrame];

        const currentMove = summary[i];
        if (!currentMove.error) {
          currentFrame.push({
            x: parseInt(currentMove.move[0]),
            y: parseInt(currentMove.move[2]),
            imagePath: currentMove.player === 'X' ? 'x.png' : 'o.png',
          });
        }
        allFrames.push(currentFrame);
      }
      allFrames.unshift([]);
      return allFrames;
    } catch (err) {
      console.error(err);
      return allFrames;
    }
  }
}

module.exports = GameViewer;
