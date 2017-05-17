const AudioCtrl = require('audio-ctrl');
const VoiceCtrl = require('voice-ctrl');

cc.Class({
    extends: cc.Component,

    properties: {
        face: cc.Node,
        word: cc.Node,
        voice: cc.Node,

        _chatList: null,
        _isPlaying: false,
    },

    onLoad: function () {
        this.face.active = false;
        this.word.active = false;
        this.voice.active = false;
        this.node.active = false;
        this._chatList = [];
    },

    switchHorizontal(isRight) {
        let scaleX = isRight ? 1 : -1;
        this.node.scaleX = scaleX
        this.word.getChildByName('content').scaleX = scaleX;
    },

    switchVertical(isTop) {
        let scaleY = isTop ? 1 : -1;
        this.node.scaleY = scaleY
        this.word.scaleY = scaleY;
        this.face.scaleY = scaleY;
    },

    showChat(type, content) {
        this.node.active = true;

        if (this._isPlaying || this._chatList.length > 0) {
            this._chatList.push({ type, content });
        } else {
            this.face.active = false;
            this.word.active = false;
            this.voice.active = false;
            this._playChat(type, content);
        }
    },

    _playChat(type, content) {
        this._isPlaying = true;

        if (type == 0) {
            this._playFace(content);
        } else if (type == 1) {
            this._playFastWord(content);
        } else if (type == 2) {
            this._playVoice(content);
        } else if (type == 3) {
            this._playNormalWord(content);
        }
    },

    _playFace(id) {
        this.face.active = true;

        if (!this._anim) {
            this._anim = this.face.getComponent(cc.Animation);
            this._anim.on('finished', () => {
                this._anim.stop();
                this.scheduleOnce(this._checkNext, 1);
            }, this);
        }

        let clipName = `face${id}`,
            clip = this._anim.getAnimationState(clipName);

        if (clip) {
            this._anim.play(clipName);
        } else {
            cc.loader.loadRes(`games/common/animations/face/${clipName}`, (err, animationClip) => {
                if (!err) {
                    this._anim.addClip(animationClip, clipName);
                    this._anim.play(clipName);
                }
            });
        }
    },

    _playFastWord(content) {
        let contentObj = JSON.parse(content);
        let sexLbl = contentObj.sex == 2 ? 'girl' : 'boy';
        cc.loader.loadRes(`games/common/audios/chat/${sexLbl}/${contentObj.id}`, (err, clip) => {
            this.word.active = true;
            this.word.getChildByName('content').getComponent(cc.Label).string = contentObj.content;
            let hideDelay = 2;
            if (!err) {
                let duration = AudioCtrl.getInstance().playSFX(clip);
                if (duration > hideDelay) {
                    hideDelay = duration;
                }
            }
            this.scheduleOnce(this._checkNext, hideDelay);
        });
    },

    _playVoice(content) {
        this.voice.active = true;

        let voiceData = JSON.parse(content),
            fileName = `location-${this._location}.amr`;

        VoiceCtrl.getInstance().writeVoice(fileName, voiceData.voice);
        VoiceCtrl.getInstance().play(fileName);
        this.scheduleOnce(() => {
            if (AudioCtrl.getInstance().isBGMPlaying()) {
                AudioCtrl.getInstance().setBGMVolume(1.0);
            }
            this._checkNext();
        }, voiceData.time / 1000);
    },

    _playNormalWord(content) {
        this.word.active = true;
        this.word.getChildByName('content').getComponent(cc.Label).string = content;
        this.scheduleOnce(this._checkNext, 2);
    },

    _checkNext() {
        this._isPlaying = false;
        this.face.active = false;
        this.word.active = false;
        this.voice.active = false;

        if (this._chatList.length > 0) {
            let chatObj = this._chatList.shift();
            this._playChat(chatObj.type, chatObj.content);
        } else {
            this.node.active = false;
        }
    }


});
