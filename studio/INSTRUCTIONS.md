# Publishing/Deploying

How do you make content go live?

## Publish

When you are editing content, usually all you need to do is publish it.

Examples:

- You add a new project, artist, blog post, or page
- You add a new format, role, or blog tag
- You change the text/image/video in a field.
- You change the content in Settings, Home, or Blog

## Publish + Deploy

Sometimes you need to both publish and deploy for changes to go live. It never hurts to deploy. This should be required in these scenarios:

- You add a redirect
- Publishing alone is not reflecting your changes (perhaps a cache issue)

---

# Uploading Video Files

Videos can be upload through Sanity in the context of a video project, or through Mux and imported on Sanity.

### Pros and Cons

|      | Via Sanity                        | Via Mux                    |
| ---- | --------------------------------- | -------------------------- |
| Pros | Easier for small amounts          | Easier for batches         |
| Cons | Doesn't name assets automatically | Requires extra import step |

## Steps for upload via Mux

- Visit: [Mux Asset Manager](https://dashboard.mux.com/organizations/sg95hk/environments/3ek1cs/video/assets)
- Click "Create New Asset"
- Drag your file (or batch of files) into window.
- Make sure it is reading your file names properly and showing them in the "Title" field. (periods in filename may interupt detection)
- Click "Next
- Change video quality to "Pro"
- Click "Start Upload"
- When everything is uploaded, go back to Sanity and open the "Videos" tab at the top of the dashboard.
- Click "Import from Mux" to get the data for the new files into the Sanity backend.
- You should now be able to assign these files to video project via the "Select" option.

## Steps for upload via Sanity

- In a video project, drag a file into the video field
- In the popup, leave settings as default and continue to upload.

Optional but suggested:

- Click [...] and "Browse" to see the full video library, or click "Videos" at the top of the Sanity dashboard.
- Click "Details" on the video you just uploaded and give it a more searchable name than the default one (in case you need to reference this video again in the future, for example in a blog post)
- Click "Save and Close"

---

# Video Thumbnails

Manually choosing a thumbnail for each new video is suggested, otherwise it will default to the first frame of the video. To do so:

- Scrub through the video preview in the video file field and pause where you want the thumbnail.
- Click the [...] button in the upper right of the video preview and choose Thumbnail. It should prefill the timestamp to where you paused.
- Click "Set Thumbnail"
- Publish your changes
