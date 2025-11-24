# COPY-PASTE INSTRUCTIONS

## You need to make 3 simple changes to page.tsx

### 1️⃣ Line 87 - Change ONE number
Find this line:
```
const debouncedComplete = useDebounceCallback(complete, 500);
```
Change `500` to `800`

---

### 2️⃣ After Line 91 - Add 7 lines
After this code:
```
useEffect(() => {
  fetchPost()
}, [postId])
```

Add these 7 lines:
```
// Load initial suggestions when post is loaded
useEffect(() => {
  if (post && !isOwner && post.isAcceptingMessages) {
    console.log("Loading initial suggestions for post:", post.content);
    complete(JSON.stringify({ postContent: post.content, userDraft: "" }));
  }
}, [post?.content, isOwner]);
```

---

### 3️⃣ Lines 112-117 - Replace 6 lines with 13 lines
Find these 6 lines:
```
const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value;
  setReplyContent(value);
  console.log("Input changed, triggering AI with:", value);
  debouncedComplete(JSON.stringify({ postContent: post?.content, userDraft: value }));
};
```

Replace with these 13 lines:
```
const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value;
  setReplyContent(value);
  
  // Only trigger AI suggestions if user has typed something
  if (value.trim().length > 0) {
    console.log("Input changed, triggering AI with:", value);
    debouncedComplete(JSON.stringify({ postContent: post?.content, userDraft: value }));
  } else {
    // If user clears input, show initial suggestions
    complete(JSON.stringify({ postContent: post?.content, userDraft: "" }));
  }
};
```

---

## That's ALL! 
After these 3 changes, your AI suggestions will appear instantly! 🚀
