import cv2
import numpy as np
from ultralytics import YOLO


class GameTracker:
    def __init__(self, model_path="yolov8n.pt"):
        # Initialize YOLO model
        self.model = YOLO(model_path)
        self.classes = self.model.names  # Get class names

        self.ball_positions = []  # Store last N positions for trajectory

    def detect_players_and_ball(self, frame):
        # Use YOLO for object detection
        results = self.model(frame, conf=0.2)
        height, width, _ = frame.shape

        players = []
        ball = None

        # Parse YOLO results
        for result in results:  # Iterate through all results
            if result.boxes:  # Check if there are detected boxes
                for box in result.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    conf = box.conf[0].item()
                    cls = int(box.cls[0].item())
                    label = self.classes[cls]

                    # Detect players
                    if label == "person":
                        players.append(((x1, y1), (x2, y2)))
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(frame, f"Player {conf:.2f}", (x1, y1 - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                    # Detect the tennis ball
                    elif label == "sports ball":  # COCO dataset label for balls
                        ball = (int((x1 + x2) / 2), int((y1 + y2) / 2))  # Center of the ball
                        radius = int((x2 - x1) / 2)
                        cv2.circle(frame, ball, radius, (0, 255, 255), 2)
                        cv2.putText(frame, f"Ball {conf:.2f}", (x1, y1 - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)

        return frame, players, ball

    def track_ball_trajectory(self, frame, ball):
        # Add ball position to the trajectory
        if ball:
            self.ball_positions.append(ball)
            if len(self.ball_positions) > 25:  # Keep last 25 positions for example
                self.ball_positions.pop(0)

            # Draw trajectory
            for i in range(1, len(self.ball_positions)):
                cv2.line(frame, self.ball_positions[i - 1], self.ball_positions[i], (255, 0, 0), 2)

    def process_video(self, video_path):
        print(f"Opening video: {video_path}")
        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            print(f"Error: Could not open video file at {video_path}")
            return

        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print(f"Finished processing {frame_count} frames")
                break

            frame_count += 1
            frame = cv2.resize(frame, (1280, 720))  # Resize for consistency

            try:
                # Detect players and ball
                frame, players, ball = self.detect_players_and_ball(frame)

                # Track ball trajectory
                self.track_ball_trajectory(frame, ball)

                # Display the frame
                cv2.imshow("Game Tracker", frame)

                # Break on 'q' press
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

            except Exception as e:
                print(f"Error processing frame {frame_count}: {e}")
                break

        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":

    tracker = GameTracker(model_path="yolov8n.pt")
    video_path = r"cricket3.mov"  # Replace with your video path
    tracker.process_video(video_path)
