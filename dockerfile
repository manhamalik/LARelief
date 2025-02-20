# Use the official LibreTranslate image
FROM libretranslate/libretranslate:latest

# Expose the default port
EXPOSE 5000

# Start LibreTranslate API
CMD ["libretranslate", "--host", "0.0.0.0", "--port", "5000"]