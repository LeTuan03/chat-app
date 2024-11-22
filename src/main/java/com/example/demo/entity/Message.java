package com.example.demo.entity;

import java.time.LocalDateTime;

public class Message {
    private String userId;
    private String message;
    private String file; // Base64 string hoặc URL của tệp video
    private LocalDateTime createdDate;

    public Message() {}

    public Message(String userId, String message, String file, LocalDateTime createdDate) {
        this.userId = userId;
        this.message = message;
        this.file = file;
        this.createdDate = createdDate;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
