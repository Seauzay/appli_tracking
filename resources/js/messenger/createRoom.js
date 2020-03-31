const MessageTemplate = require('./MessageTemplate').MessageTemplate;
const MessageAPI = require('./MessageAPI').MessageAPI;


class RoomList {
    constructor(tablist) {
        this.tablist = tablist;
        this.rooms = [];
    }

    addRoom(id, name) {
        if (this.rooms.indexOf(id) === -1) {
            const pos = this.tablist.addTab({title: name});
            const api = createRoom(this.tablist.contentOfTab(pos + 1), id);
            api.callback = () => {
                this.tablist.notify(pos+1);
            };
            this.rooms.push(id);
        }
    }

    update() {
        $.ajax('msg/list', {
            success: (data) => {
                data.rooms.forEach(room => {
                    this.addRoom(room.id, room.name);
                });
            }
        });
    }
}


function createRoom(where, room_id) {
    where = $(where);
    if (!window.messageTemplate) {
        window.messageTemplate = new MessageTemplate('#message-template');
    }

    const node = $('#room-template').clone();
    const form = node.find('form');
    const new_action = form.attr('action').replace('{id}', room_id);
    form.attr('action', new_action);

    where.append(node);

    return new MessageAPI(room_id, where.find('.message-container')[0], window.messageTemplate, where.find('.message-form')[0]);
}

exports.createRoom = createRoom;
exports.RoomList = RoomList;