<?php
defined('ABSPATH') || exit;
$plugin_url = plugin_dir_url(dirname(__DIR__));
?>

<div id="wp-chatbot-chat-container"></div>
<script type="module" src="<?php echo esc_url($plugin_url . "/assets/chat__MAIN_JS__", ); ?>"></script>
<script>
    
    window.wpbChatbotConfig = {
            root: "<?php echo esc_url_raw( rest_url() ); ?>",
            nonce: "<?php echo esc_attr( wp_create_nonce( 'wp_rest' ) ); ?>",
            chatTheme: <?php echo wp_json_encode($configs["chatTheme"] ?? null); ?>
        };

    jQuery(document).ready(function($) {
        $("#wp-chatbot-chat-container").on("keyup", function(event) {
            event.stopPropagation();
        })

        $("#wp-chatbot-chat-container").on("keydown", function(event) {
            event.stopPropagation();
        })

        let shadowLink = document.createElement("link");
        shadowLink.setAttribute("rel", "stylesheet");
        shadowLink.setAttribute("href", '<?php echo esc_url($plugin_url . "/assets/chat__STYLE_LINK__"); ?>');
    
        $("#wp-chatbot-chat-container")[0].shadowRoot.prepend(shadowLink);
    });
</script>