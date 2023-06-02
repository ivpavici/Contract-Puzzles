const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    let randomWallet = ethers.Wallet.createRandom();
    const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;

    while(randomWallet.address >= threshold) {
      randomWallet = ethers.Wallet.createRandom();
    }

    const winningSigner = await randomWallet.connect(ethers.provider);

    // send funds from defaultSigner to the winningSigner
    const defaultSigner = await ethers.provider.getSigner(0);
    const tx = {
      to: winningSigner.address,
      value: ethers.utils.parseEther("1.0")
    }
    await defaultSigner.sendTransaction(tx);

    await game.connect(winningSigner).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
