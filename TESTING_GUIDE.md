# Testing Guide - SPECOPS-1445

## Apryse PDF Viewer Controls Testing

This document provides test cases to validate all acceptance criteria from SPECOPS-1445.

---

## Prerequisites

- Application running at `http://localhost:3000`
- Sample PDF loaded (multi-page PDF recommended for full testing)
- Browser developer console open for debugging

---

## Test Cases

### TC1: Rotate Clockwise Control

**Objective**: Verify that the PDF can be rotated 90° clockwise

**Steps**:
1. Launch the application
2. Wait for PDF to load
3. Click "↷ Rotate Right" button
4. Observe the PDF viewer

**Expected Results**:
- ✅ PDF rotates 90° clockwise
- ✅ Rotation status displays "Rotation: 90°"
- ✅ Subsequent clicks rotate to 180°, 270°, 0° (full cycle)
- ✅ Rotation is smooth and immediate
- ✅ Page content remains readable after rotation

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC2: Rotate Counter-clockwise Control

**Objective**: Verify that the PDF can be rotated 90° counter-clockwise

**Steps**:
1. Launch the application
2. Wait for PDF to load
3. Click "↶ Rotate Left" button
4. Observe the PDF viewer

**Expected Results**:
- ✅ PDF rotates 90° counter-clockwise (270° from original)
- ✅ Rotation status displays "Rotation: 270°"
- ✅ Subsequent clicks rotate to 180°, 90°, 0° (full cycle)
- ✅ Rotation is smooth and immediate
- ✅ Content remains readable after rotation

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC3: Zoom In Control

**Objective**: Verify that the PDF can be zoomed in

**Steps**:
1. Launch the application
2. Wait for PDF to load
3. Note the initial zoom level (e.g., "100%")
4. Click "🔍+ Zoom In" button
5. Observe the PDF viewer and zoom percentage

**Expected Results**:
- ✅ PDF content enlarges
- ✅ Zoom percentage increases (e.g., from 100% to 125%)
- ✅ Text becomes larger and more readable
- ✅ Multiple clicks continue to increase zoom
- ✅ Zoom is smooth without flickering

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC4: Zoom Out Control

**Objective**: Verify that the PDF can be zoomed out

**Steps**:
1. Launch the application
2. Wait for PDF to load
3. Click "🔍+ Zoom In" twice (to have room to zoom out)
4. Click "🔍− Zoom Out" button
5. Observe the PDF viewer and zoom percentage

**Expected Results**:
- ✅ PDF content shrinks
- ✅ Zoom percentage decreases
- ✅ More of the page becomes visible
- ✅ Multiple clicks continue to decrease zoom
- ✅ Zoom maintains aspect ratio

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC5: Page Navigation - Next Page

**Objective**: Verify navigation to the next page

**Prerequisites**: Use a multi-page PDF (at least 3 pages)

**Steps**:
1. Launch the application with multi-page PDF
2. Wait for PDF to load
3. Verify you're on page 1 (check "Page 1 of X")
4. Click "Next →" button
5. Observe the page counter and displayed content

**Expected Results**:
- ✅ Page counter updates to "Page 2 of X"
- ✅ PDF displays page 2 content
- ✅ Navigation is immediate
- ✅ "Next" button is enabled while pages remain
- ✅ "Next" button is disabled on last page

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC6: Page Navigation - Previous Page

**Objective**: Verify navigation to the previous page

**Prerequisites**: Use a multi-page PDF (at least 3 pages)

**Steps**:
1. Launch the application with multi-page PDF
2. Navigate to page 2 (using "Next" button)
3. Click "← Previous" button
4. Observe the page counter and displayed content

**Expected Results**:
- ✅ Page counter updates to "Page 1 of X"
- ✅ PDF displays page 1 content
- ✅ Navigation is immediate
- ✅ "Previous" button is disabled on first page
- ✅ "Previous" button is enabled on other pages

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC7: Highlights Toggle - Enable

**Objective**: Verify that highlights can be toggled on

**Steps**:
1. Launch the application
2. Wait for PDF to load
3. Verify highlights are off (button shows "○ Highlights OFF")
4. Click the highlights toggle button
5. Observe the PDF viewer

**Expected Results**:
- ✅ Button text changes to "✓ Highlights ON"
- ✅ Button gets "active" styling (green background)
- ✅ Highlight annotations appear on the PDF
- ✅ Status text shows "Showing recognized fields"
- ✅ Highlights are visually distinct (colored overlays)

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC8: Highlights Toggle - Disable

**Objective**: Verify that highlights can be toggled off

**Steps**:
1. Launch the application
2. Enable highlights (follow TC7)
3. Click the highlights toggle button again
4. Observe the PDF viewer

**Expected Results**:
- ✅ Button text changes to "○ Highlights OFF"
- ✅ Button returns to default styling
- ✅ All highlight annotations are removed
- ✅ Status text shows "Highlights disabled"
- ✅ PDF content is unchanged (only highlights removed)

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC9: Combined Controls Test

**Objective**: Verify that multiple controls work together

**Steps**:
1. Launch the application
2. Rotate the PDF clockwise
3. Zoom in 2 times
4. Navigate to page 2
5. Enable highlights
6. Rotate counter-clockwise
7. Zoom out once

**Expected Results**:
- ✅ All controls function correctly in sequence
- ✅ No conflicts between different controls
- ✅ State is maintained (highlights stay on during rotation/zoom)
- ✅ Page number is maintained during rotation/zoom
- ✅ All status indicators update correctly

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC10: Error Handling - No PDF

**Objective**: Verify error handling when PDF is missing

**Steps**:
1. Remove or rename `sample.pdf` from public folder
2. Launch the application
3. Observe behavior

**Expected Results**:
- ✅ Application displays error message
- ✅ Controls are disabled (or show appropriate state)
- ✅ No JavaScript errors in console
- ✅ User receives clear feedback about the issue

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC11: Performance Test

**Objective**: Verify performance with large PDF

**Prerequisites**: Use a large PDF (50+ pages, 10+ MB)

**Steps**:
1. Load a large PDF
2. Test all rotation controls
3. Test zoom controls
4. Navigate through multiple pages
5. Toggle highlights

**Expected Results**:
- ✅ Initial load time < 5 seconds
- ✅ Rotation response time < 200ms
- ✅ Zoom response time < 200ms
- ✅ Page navigation < 300ms
- ✅ Highlights toggle < 500ms
- ✅ No lag or freezing during operations

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

### TC12: Responsive Design

**Objective**: Verify controls work on different screen sizes

**Steps**:
1. Launch application in desktop browser
2. Test all controls
3. Resize browser to tablet size (768px width)
4. Test all controls again
5. Resize to mobile size (375px width)
6. Test all controls again

**Expected Results**:
- ✅ Controls are accessible on all screen sizes
- ✅ Layout adjusts appropriately
- ✅ Buttons remain clickable
- ✅ Text is readable
- ✅ No horizontal scrolling required

**Status**: ☐ Pass ☐ Fail

**Notes**: _______________________________________

---

## Acceptance Criteria Validation

### AC1: Out-of-the-Box Controls Investigation

| Feature | Test Case | Status | Notes |
|---------|-----------|--------|-------|
| Rotate Clockwise | TC1 | ☐ | |
| Rotate Counter-clockwise | TC2 | ☐ | |
| Zoom In | TC3 | ☐ | |
| Zoom Out | TC4 | ☐ | |
| Next Page | TC5 | ☐ | |
| Previous Page | TC6 | ☐ | |
| Highlights Toggle | TC7, TC8 | ☐ | |

**AC1 Status**: ☐ Met ☐ Not Met

---

### AC2: Findings Document

**Requirements**:
- ✅ Document outlines what is available out of the box
- ✅ Document identifies what requires custom development
- ✅ Document lists known limitations or constraints

**Deliverable**: [FINDINGS.md](./FINDINGS.md)

**AC2 Status**: ☐ Met ☐ Not Met

---

### AC3: Implementation Recommendation

**Requirements**:
- ✅ Recommendation provided for PDF viewer implementation approach
- ✅ Based on findings from AC1 and AC2
- ✅ Includes effort estimates and risks

**Deliverable**: Section 5 of [FINDINGS.md](./FINDINGS.md)

**AC3 Status**: ☐ Met ☐ Not Met

---

## Known Issues

_Document any bugs or issues discovered during testing:_

1. 
2. 
3. 

---

## Browser Compatibility

Test on the following browsers:

| Browser | Version | TC1-8 Status | Notes |
|---------|---------|--------------|-------|
| Chrome | Latest | ☐ Pass ☐ Fail | |
| Firefox | Latest | ☐ Pass ☐ Fail | |
| Safari | Latest | ☐ Pass ☐ Fail | |
| Edge | Latest | ☐ Pass ☐ Fail | |

---

## Sign-off

**Tester Name**: _______________________  
**Date**: _______________________  
**Overall Result**: ☐ All Tests Pass ☐ Some Tests Fail  
**Ready for Demo**: ☐ Yes ☐ No  

**Comments**:
_______________________________________________
_______________________________________________
_______________________________________________

---

## Next Steps After Testing

1. ☐ Demo application to stakeholders
2. ☐ Review FINDINGS.md with team
3. ☐ Decision on Apryse license procurement
4. ☐ Create implementation stories
5. ☐ Plan for form field recognition integration
