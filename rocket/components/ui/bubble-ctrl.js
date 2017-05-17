cc.Class({
    extends: cc.Component,

    properties: {
        bubblePrefab: cc.Prefab,
        originalY: 0,
        destinationY: 0,
    },

    onLoad: function () {
        this._items = [];
        this._pool = new cc.NodePool();
    },

    clear() {
        while (this._items.length > 0) {
            let item = this._items.pop();
            item.stopAllActions();
            this._pool.put(item.removeFromParent());
        }
    },

    add(content, hideDelay = 1000, isAction = true) {
        let item = null;
        if (this._pool.size() > 0) {
            item = this._pool.get();
        } else {
            item = cc.instantiate(this.bubblePrefab);
        }
        item.parent = this.node;
        item.getComponent('bubble-panel').setContent(content);
        this._items.push(item);

        if (hideDelay == 0) {
            item.y = this.destinationY;
        } else {
            item.y = this.originalY;
        }

        let action = cc.spawn(cc.moveTo(0.5, 0, this.destinationY), cc.fadeIn(1));
        let finish = cc.callFunc((target) => {
            setTimeout((removeTarget) => {
                removeTarget.stopAllActions();
                this._pool.put(removeTarget.removeFromParent());
            }, hideDelay, target);
        }, this, item);

        if (isAction) {
            item.runAction(cc.sequence(action.easing(cc.easeBackOut()), finish));
        } else {
            item.runAction(finish);
        }
    },
});
