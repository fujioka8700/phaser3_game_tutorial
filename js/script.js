// ゲーム構成設定
var config = {
  type: Phaser.AUTO, // レンダラーを指定する
  width: 800, // ゲームの幅
  height: 600, // ゲームの高さ

  // 物理構成
  physics: {
    default: 'arcade', // デフォルトの物理システム。シーンごとに起動する

    // arcade の物理設定
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },

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

  platforms = this.physics.add.staticGroup() // 静的物理グループオブジェクトを作成する

  // 新しいゲームオブジェクトを作成し、このグループに追加する
  // setScale は比率、縮尺比
  // refreshBody は Body の位置とサイズを親ゲームオブジェクトと同期する
  platforms.create(400, 568, 'ground').setScale(2).refreshBody()

  platforms.create(600, 400, 'ground')
  platforms.create(50, 250, 'ground')
  platforms.create(750, 220, 'ground')
}

// ゲーム進行時に呼び出される関数
function update() {}
