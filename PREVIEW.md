# Preview the new docs site

The new FreeMoCap docs are on a test server, not on the real `docs.freemocap.org` yet. Anyone can look at them by pointing their own computer at that server. This changes nothing for anyone else, and it takes about two minutes.

You are telling your computer: "when I type `docs.freemocap.org`, go to this server." You do that by adding one line to a file called `hosts`.

The line to add is:

```
198.71.57.235 docs.freemocap.org
```

Follow the section for your computer, then read **Open the site** and **When you're done**.

## macOS

1. Open Terminal.
2. Open the hosts file in an editor with administrator rights. This asks for your password:

   ```bash
   sudo nano /etc/hosts
   ```

3. Go to the bottom of the file, add the line above on its own line, then press Ctrl+O, Enter, and Ctrl+X to save and exit.
4. Clear the DNS cache:

   ```bash
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```

## Windows

1. Click Start and type `Notepad`. Right-click it and choose **Run as administrator**.
2. In Notepad, choose **File > Open**, paste this path, and press Enter:

   ```
   C:\Windows\System32\drivers\etc\hosts
   ```

   If you don't see the file, change the file type box at the bottom right from "Text Documents" to "All Files".
3. Add the line above at the bottom on its own line, then save with Ctrl+S.
4. Open Command Prompt and clear the DNS cache:

   ```
   ipconfig /flushdns
   ```

If Windows says you can't save the file, Notepad was not opened as administrator. Close it and start again from step 1.

## Linux

1. Open a terminal.
2. Open the hosts file in an editor with administrator rights:

   ```bash
   sudo nano /etc/hosts
   ```

3. Add the line above at the bottom on its own line, then press Ctrl+O, Enter, and Ctrl+X to save and exit.
4. Most Linux systems pick the change up right away. If the old site still shows, clear the cache with whichever of these applies to you:

   ```bash
   sudo resolvectl flush-caches
   ```

   ```bash
   sudo systemctl restart nscd
   ```

## Open the site

Go to `https://docs.freemocap.org`.

Your browser will warn you that the connection is not private. That is expected: the test server does not have a certificate for this name yet. Choose **Advanced** and then **Proceed** (the wording varies by browser). Only do this for this test, and only while the hosts line above is in place.

You are on the new site if you see a version menu reading **2.0 (alpha)** in the top bar and a **Get started** section in the left sidebar. The old placeholder page has neither.

## If the old site still shows

- Open the page in a private or incognito window.
- Turn off "secure DNS" or "DNS over HTTPS" in your browser settings. Some browsers skip the hosts file when it is on.
- Check the line is spelled exactly as above, with no `#` at the start, and that the file was saved.
- Close the browser fully and open it again.

## When you're done

**Remove the line.** When the real site moves to the new server, a leftover line can send you to the wrong place.

Open the same hosts file the same way, delete the `198.71.57.235 docs.freemocap.org` line, save, and run the cache command for your system again.

## For developers

You can check the test server without editing any file:

```bash
curl -sk --resolve docs.freemocap.org:443:198.71.57.235 https://docs.freemocap.org/ | head
```

How the site gets onto the test server, and what is left before it goes live, is in the [README](README.md) and [DEPLOY-PLAN.md](DEPLOY-PLAN.md).
