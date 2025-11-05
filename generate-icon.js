const fs = require('fs');
const path = require('path');

const iconBase64 = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABuUlEQVR4nO2ZwQ3CMBBF3Q1Rskg7S5XWcjObSkfNFMCA7j3KcD7M3m9k3xYAAAAAOD8VY3gY7TDHgQfRMAAx3EGD3HwZcoIuAHvY4FUAFeArYAwZ4FzQO3Bf6HTuHkENLqWAfQDmoAMnAVfAOUg5rW4MTAX8jrwEbA+4AU4BZG6grgKuAa+A+cA04AvwDRgAjCObIBKwAf/B9HqAiEFwH7YDGZ1TMRzh7kQhzE1aUDYvlBjAjW+tk5jrMGJPwElgmX+PzBdiGxEPF9gUwCt0qVCD4D7w6+vZQjXN+wKxtGb0R2AJuAH2JXECMBjYRX2EBt9PzBcCDg9ArhEfR9Iv8DuBbzYkU+H/B+wAAAABJRU5ErkJggg==";

const buffer = Buffer.from(iconBase64, 'base64');
const outputPath = path.join(__dirname, 'assets', 'icon.png');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buffer);

console.log('✅ icon.png created at: assets/icon.png');
