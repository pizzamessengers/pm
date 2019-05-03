<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class MessagesCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messages;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(array $messages)
    {
        $this->messages = $messages;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
    return new PrivateChannel('messages.'.$this->messages[0]->dialog_id);
    }

    public function broadcastAs()
    {
        return 'messages.created';
    }

    public function broadcastWith()
    {
        $this->messages = collect($this->messages)->sortBy('timestamp')->values();
        $messages = array();
        foreach ($this->messages as $message) {
            $author = $message->author();
            array_push($messages, array(
                'id' => $message->id,
                'from_me' => $message->from_me,
                'text' => $message->text,
                'timestamp' => $message->timestamp,
                'attachments' => $message->attachments(),
                'author' => array(
                    'id' => $author->id,
                    'name' => $author->first_name.' '.$author->last_name,
                    'avatar' => $author->avatar
                )
            ));
        }
        return array(
          'messages' => $messages
        );
    }
}
