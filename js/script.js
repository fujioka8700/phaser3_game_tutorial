var config = {
  type: Phaser.AUTO, // レンダラーを指定する
  width: 800, // ゲームの幅
  height: 600, // ゲームの高さ

  // ゲームに追加するシーン
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

var game = new Phaser.Game(config) // ゲーム全体のコントローラー

// ゲーム開始前に呼び出される関数定義
function preload() {
  this.load.image('sky', 'assets/sky.png') // イメージをロードする
  this.load.image('ground', 'assets/platform.png')
  this.load.image('star', 'assets/star.png')
  this.load.image('bomb', 'assets/bomb.png')

  // スプライトシートをロードする
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  })
}

// ゲーム開始時に呼び出される関数
function create() {
  this.add.image(400, 300, 'sky') // 新しいイメージオブジェクトを作成し、シーンに追加する
  this.add.image(400, 300, 'star')
}

// ゲーム進行時に呼び出される関数
function update() {}
