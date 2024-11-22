package com.example.demo.controller;

import com.example.demo.entity.Greeting;
import com.example.demo.entity.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class MessageController {
    @MessageMapping("/message")
    @SendTo("/topic/greetings")
    public Message handleMessage(Message message) throws Exception {
        // Xử lý tệp video nếu cần
        if (message.getFile() != null) {
            System.out.println("Received video file: " + message.getFile());
        }

        // Trả lại Message với thông tin đã xử lý
        return new Message(
                message.getUserId(),
                message.getMessage(),
                message.getFile(),
                message.getCreatedDate()
        );
    }
}
