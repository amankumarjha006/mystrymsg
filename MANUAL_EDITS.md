## Quick Manual Edits for page.tsx

Since automated edits are causing file corruption, here are the 3 simple manual changes you need to make to `app/(app)/u/[username]/posts/[postId]/page.tsx`:

### Change 1: Update Debounce Timing (Line 87)
**Find:**
```typescript
const debouncedComplete = useDebounceCallback(complete, 500);
```

**Replace with:**
```typescript
const debouncedComplete = useDebounceCallback(complete, 800);
```

---

### Change 2: Add Initial Suggestions Loading (After Line 91)
**Find:**
```typescript
useEffect(() => {
  fetchPost()
}, [postId])

useEffect(() => {
  console.log("Current completion:", completion);
}, [completion]);
```

**Replace with:**
```typescript
useEffect(() => {
  fetchPost()
}, [postId])

// Load initial suggestions when post is loaded
useEffect(() => {
  if (post && !isOwner && post.isAcceptingMessages) {
    console.log("Loading initial suggestions for post:", post.content);
    complete(JSON.stringify({ postContent: post.content, userDraft: "" }));
  }
}, [post?.content, isOwner]);

useEffect(() => {
  console.log("Current completion:", completion);
}, [completion]);
```

---

### Change 3: Improve handleInputChange (Lines 112-117)
**Find:**
```typescript
const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value;
  setReplyContent(value);
  console.log("Input changed, triggering AI with:", value);
  debouncedComplete(JSON.stringify({ postContent: post?.content, userDraft: value }));
};
```

**Replace with:**
```typescript
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

## That's it!

Just make these 3 changes, add your `OPENROUTER_API_KEY` to `.env`, and you're done!
