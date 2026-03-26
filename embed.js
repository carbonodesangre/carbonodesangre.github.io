"use strict";

var EMBED_URL = 'https://embed.bsky.app';

window.bluesky = window.bluesky || {
    scan: scan,
};

/**
 * Listen for messages from the Bluesky embed iframe and adjust the height of
 * the iframe accordingly.
 */
window.addEventListener('message', function (event) {
    if (event.origin !== EMBED_URL) {
        return;
    }

    var id = event.data.id;
    if (!id) {
        return;
    }

    var embed = document.querySelector('[data-bluesky-id="' + id + '"]');
    if (!embed) {
        return;
    }

    var height = event.data.height;
    if (height) {
        embed.style.height = height + "px";
    }
});

/**
 * Scan the document for all elements with the data-bluesky-uri attribute,
 * and initialize them as Bluesky embeds.
 */
function scan(node) {
    if (node === void 0) { node = document; }

    var embeds = node.querySelectorAll('[data-bluesky-uri]');

    for (var i = 0; i < embeds.length; i++) {
        var id = String(Math.random()).slice(2);
        var embed = embeds[i];
        var aturi = embed.getAttribute('data-bluesky-uri');

        if (!aturi) {
            continue;
        }

        var ref_url = location.origin + location.pathname;
        var searchParams = new URLSearchParams();
        searchParams.set('id', id);

        if (ref_url.startsWith('http')) {
            searchParams.set('ref_url', encodeURIComponent(ref_url));
        }

        if (embed.dataset.blueskyEmbedColorMode) {
            searchParams.set('colorMode', embed.dataset.blueskyEmbedColorMode);
        }

        var iframe = document.createElement('iframe');
        iframe.setAttribute('data-bluesky-id', id);
        iframe.src = EMBED_URL + "/embed/" + aturi.slice('at://'.length) + "?" + searchParams.toString();
        iframe.width = '100%';
        iframe.style.border = 'none';
        iframe.style.display = 'block';
        iframe.style.flexGrow = '1';
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';

        var container = document.createElement('div');
        container.style.maxWidth = '600px';
        container.style.width = '100%';
        container.style.marginTop = '10px';
        container.style.marginBottom = '10px';

        /* 🔹 CENTRADO REAL */
        container.style.marginLeft = 'auto';
        container.style.marginRight = 'auto';

        container.style.display = 'flex';
        container.className = 'bluesky-embed';

        container.appendChild(iframe);
        embed.replaceWith(container);
    }
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    scan();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        scan();
    });
}
