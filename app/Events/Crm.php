<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class CrmConnection implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $crm;

    public $token;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(\App\User $user, $crm)
    {
        $this->crm = $crm;
        $this->token = $user->api_token;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel($this->token.'.crm');
    }

    public function broadcastAs()
    {
        return 'crm.connection';
    }

    public function broadcastWith()
    {
        return array(
          'crm' => $this->crm
        );
    }
}
