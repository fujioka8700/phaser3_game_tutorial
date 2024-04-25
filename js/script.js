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

var player
var stars
var platforms
var cursors
var score = 0
var scoreText
var bombs
var gameOver = false

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
  // refreshBody は Body の位置とサイズを、親ゲームオブジェクトと同期する
  platforms.create(400, 568, 'ground').setScale(2).refreshBody()
  platforms.create(600, 400, 'ground')
  platforms.create(50, 250, 'ground')
  platforms.create(750, 220, 'ground')

  // 新しいスプライトゲームオブジェクトを作成し、シーンにに追加する
  player = this.physics.add.sprite(100, 450, 'dude')

  // このボディの弾む値を設定する
  player.setBounce(0.2)

  // このボディが、ワールド境界と衝突するかどうかを設定する
  player.setCollideWorldBounds(true)

  // 新しいアニメーションを作成し、アニメーション マネージャーに追加する
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  })

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  })

  // カーソルオブジェクトに、4つのプロパティ(上、下、左、右)が設定される
  cursors = this.input.keyboard.createCursorKeys()

  // 新しいグループゲームオブジェクトを作成し、シーンに追加する
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  })

  // stars に対して、反復処理を行う
  stars.children.iterate(function (child) {
    // このボディの垂直方向のバウンス値を設定する
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
  })

  // 新しいグループゲームオブジェクトを作成し、シーンに追加する
  bombs = this.physics.add.group()

  // 新しいテキストゲームオブジェクトを作成し、シーンに追加する
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })

  // 新しい ArcadePhysicsCollider オブジェクトを作成し、
  // 2つのオブジェクト間の衝突、または重なりを自動的にチェックする
  this.physics.add.collider(player, platforms)
  this.physics.add.collider(stars, platforms)
  this.physics.add.collider(bombs, platforms)

  // ゲームオブジェクトが、重なっているかどうかをテストする
  this.physics.add.overlap(player, stars, collectStar, null, this)

  // 新しい ArcadePhysicsCollider オブジェクトを作成し、
  // 2つのオブジェクトが衝突したときに、コールバックを呼び出す
  this.physics.add.collider(player, bombs, hitBomb, null, this)
}

// ゲーム進行時に呼び出される関数
function update() {
  // 右キーが「ダウン」状態の時
  if (cursors.right.isDown) {
    // ボディの速度の水平成分を、設定する
    player.setVelocityX(160)

    // このスプライトで、指定されたアニメーションの再生を、開始する
    player.anims.play('right', true)

    // 左キーが「ダウン」状態の時
  } else if (cursors.left.isDown) {
    player.setVelocityX(-160)

    player.anims.play('left', true)
  } else {
    player.setVelocityX(0)

    player.anims.play('turn')
  }

  // このボディが、他のボディまたは静的ボディと衝突しているかどうか、
  // およびどの方向に衝突しているかチェックする
  if (cursors.up.isDown && player.body.touching.down) {
    // ボディの速度の垂直成分を、設定する
    player.setVelocityY(-330)
  }
}

// スターに触れると、スターの存在を消す
function collectStar(player, star) {
  // このゲームオブジェクトの本体を停止して無効にする
  star.disableBody(true, true)

  score += 10
  // 表示するテキストを設定する
  scoreText.setText('Score: ' + score)

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true)
    })

    var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

    var bomb = bombs.create(x, 16, 'bomb')
    bomb.setBounce(1)
    bomb.setCollideWorldBounds(true)
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
  }
}

function hitBomb(player, bomb) {
  // 物理シミュレーションを一時停止する
  this.physics.pause()

  // このゲームオブジェクトに、追加の色合いを設定する
  player.setTint(0xff0000)

  player.anims.play('turn')

  gameOver = true
}
