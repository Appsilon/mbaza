# This script extracts image frames from camera trap videos
# It then copies the images to a new directory (replicating original video dir structure)
# This new image directory can then be classified

# paths for testing
video_data_folder = '/home/robbie/Documents/MbazaVideoTest/videos/' # user selects video directory

new_image_data_folder = '/home/robbie/Documents/MbazaVideoTest/images/' # user selects empty directory for images

videos = get_videos(video_data_folder)

copy_dir_tree(video_data_folder, new_image_data_folder)

# Loop through videos and extract frames to new image directory
for videos in videos:
    
    vid = cv2.VideoCapture(videos) # read video
    
    frameIndex = 0
    
    while(True):
        # Extract images
        vid.set(cv2.CAP_PROP_POS_MSEC,(frameIndex*5000)) # frame every 5 seconds
        ret, frame = vid.read()
        # end of frames
        if not ret: 
            break
        # Saves images
        name = os.path.dirname(os.path.abspath(videos.replace(video_data_folder, new_image_data_folder))) + '/' + get_filename(videos) + '_' + f"{frameIndex+1:02d}" + '.jpg'
        print ('Creating...' + name)
        cv2.imwrite(name, frame)
    
        # next frame
        frameIndex += 1