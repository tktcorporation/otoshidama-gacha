FROM mcr.microsoft.com/devcontainers/base:bookworm

RUN apt-get update && apt-get install -y build-essential curl

RUN curl -L "https://github.com/supabase/cli/releases/latest/download/supabase_linux_arm64.tar.gz" -o supabase.tar.gz && \
    tar -xzf supabase.tar.gz -C /usr/local/bin && \
    rm supabase.tar.gz
