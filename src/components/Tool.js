import styled from 'styled-components';
// import languages from '../libs/languages';
import { t, Translate } from 'react-i18nify';
import React, { useState, useCallback } from 'react';
import { getExt, download } from '../utils';
import { file2sub, sub2vtt, sub2srt, sub2txt, url2sub, vtt2url } from '../libs/readSub';
import sub2ass from '../libs/readSub/sub2ass';
// import googleTranslate from '../libs/googleTranslate';
// import englishKeywordsTranslate from '../libs/englishKeywordsTranslate';
import FFmpeg from '@ffmpeg/ffmpeg';
import SimpleFS from '@forlagshuset/simple-fs';
import HamburgerMenu from 'react-hamburger-menu';
import '../utils/ToolNavigation.css';

const Style = styled.div`
    border-left: 1px solid white;

    .tool-button {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px 10px 2px 0;
        margin-bottom: 5px;

        .icon {
            cursor: pointer;
        }
    }

    .import {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .btn {
            position: relative;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 48%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #3f51b5;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }

        .file {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }

    .burn {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .btn {
            position: relative;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 100%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #673ab7;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .export {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .btn {
            position: relative;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 31%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #009688;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .operate {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .btn {
            position: relative;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 48%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #009688;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .configuration {
        &-heading {
            padding-left: 10px;
            margin-top: -0.5px;
        }

        &-options {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            border-bottom: 1px solid rgb(255 255 255 / 20%);
            align-items: center;
            margin-top: -10px;
            padding-left: 10px;

            .btn {
                position: relative;
                opacity: 0.85;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 35px;
                width: 90%;
                border-radius: 3px;
                color: #fff;
                cursor: pointer;
                font-size: 13px;
                background-color: #009688;
                transition: all 0.2s ease 0s;
                margin-bottom: 10px;
                letter-spacing: 1.3px;

                &:hover {
                    opacity: 1;
                }
            }
        }
    }

    .translate {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        select {
            width: 65%;
            outline: none;
            padding: 0 5px;
            border-radius: 3px;
        }

        .btn {
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 33%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #673ab7;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }
    .youtube-link {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .youtube-textarea {
            width: 65%;
            outline: none;
            padding: 0 5px;
            border-radius: 3px;
        }

        .btn {
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 33%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #673ab7;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .hotkey {
        display: flex;
        justify-content: space-between;
        padding: 10px;

        span {
            width: 49%;
            font-size: 13px;
            padding: 5px 0;
            border-radius: 3px;
            text-align: center;
            color: rgb(255 255 255 / 75%);
            background-color: rgb(255 255 255 / 20%);
        }
    }

    .bottom {
        padding: 10px;
        a {
            display: flex;
            flex-direction: column;
            border: 1px solid rgb(255 255 255 / 30%);
            text-decoration: none;

            .title {
                color: #ffeb3b;
                padding: 5px 10px;
                animation: animation 3s infinite;
                border-bottom: 1px solid rgb(255 255 255 / 30%);
            }

            @keyframes animation {
                50% {
                    color: #00bcd4;
                }
            }

            img {
                max-width: 100%;
            }
        }
    }

    .progress {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        z-index: 9;
        height: 2px;
        background-color: rgb(0 0 0 / 50%);

        span {
            display: inline-block;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 0;
            height: 100%;
            background-color: #ff9800;
            transition: all 0.2s ease 0s;
        }
    }
`;

FFmpeg.createFFmpeg({ log: true }).load();
const fs = new SimpleFS.FileSystem();

export default function Header({
    player,
    waveform,
    newSub,
    undoSubs,
    clearSubs,
    language,
    subtitle,
    setLoading,
    formatSub,
    setSubtitle,
    setProcessing,
    notify,
    subtitleEnglish,
    setSubtitleEnglish,
    clearSubsEnglish,
    setSubtitleOriginal,
    clearedSubs,
    setClearedSubs,
    configuration,
    setConfiguration,
}) {
    // const [translate, setTranslate] = useState('en');
    const [videoFile, setVideoFile] = useState(null);
    const [youtubeURL, setYoutubeURL] = useState('');
    const translate = 'en';
    const [toolOpen, setToolOpen] = useState(true);

    const clearSubsHandler = () => {
        window.localStorage.setItem('subsBeforeClear', JSON.stringify(subtitle));

        let tempSubs = subtitle.slice(0);
        tempSubs.map((sub) => {
            sub.text = '';
            sub.text2 = '';
            return true;
        });

        setSubtitleOriginal(tempSubs);
        setClearedSubs(true);
    };

    const decodeAudioData = useCallback(
        async (file) => {
            try {
                const { createFFmpeg, fetchFile } = FFmpeg;
                const ffmpeg = createFFmpeg({ log: true });
                ffmpeg.setProgress(({ ratio }) => setProcessing(ratio * 100));
                setLoading(t('LOADING_FFMPEG'));
                await ffmpeg.load();
                ffmpeg.FS('writeFile', file.name, await fetchFile(file));
                setLoading('');
                notify({
                    message: t('DECODE_START'),
                    level: 'info',
                });
                const output = `${Date.now()}.mp3`;
                await ffmpeg.run('-i', file.name, '-ac', '1', '-ar', '8000', output);
                const uint8 = ffmpeg.FS('readFile', output);
                // download(URL.createObjectURL(new Blob([uint8])), `${output}`);
                await waveform.decoder.decodeAudioData(uint8);
                waveform.drawer.update();
                setProcessing(0);
                ffmpeg.setProgress(() => null);
                notify({
                    message: t('DECODE_SUCCESS'),
                    level: 'success',
                });
            } catch (error) {
                setLoading('');
                setProcessing(0);
                notify({
                    message: t('DECODE_ERROR'),
                    level: 'error',
                });
            }
        },
        [waveform, notify, setProcessing, setLoading],
    );

    const burnSubtitles = useCallback(async () => {
        try {
            const { createFFmpeg, fetchFile } = FFmpeg;
            const ffmpeg = createFFmpeg({ log: true });
            ffmpeg.setProgress(({ ratio }) => setProcessing(ratio * 100));
            setLoading(t('LOADING_FFMPEG'));
            await ffmpeg.load();
            setLoading(t('LOADING_FONT'));

            await fs.mkdir('/fonts');
            const fontExist = await fs.exists('/fonts/Microsoft-YaHei.ttf');
            if (fontExist) {
                const fontBlob = await fs.readFile('/fonts/Microsoft-YaHei.ttf');
                ffmpeg.FS('writeFile', `tmp/Microsoft-YaHei.ttf`, await fetchFile(fontBlob));
            } else {
                const fontUrl = 'https://cdn.jsdelivr.net/gh/zhw2590582/SubPlayer/docs/Microsoft-YaHei.ttf';
                const fontBlob = await fetch(fontUrl).then((res) => res.blob());
                await fs.writeFile('/fonts/Microsoft-YaHei.ttf', fontBlob);
                ffmpeg.FS('writeFile', `tmp/Microsoft-YaHei.ttf`, await fetchFile(fontBlob));
            }
            setLoading(t('LOADING_VIDEO'));
            ffmpeg.FS(
                'writeFile',
                videoFile ? videoFile.name : 'sample.mp4',
                await fetchFile(videoFile || 'sample.mp4'),
            );
            setLoading(t('LOADING_SUB'));
            const subtitleFile = new File([new Blob([sub2ass(subtitle)])], 'subtitle.ass');
            ffmpeg.FS('writeFile', subtitleFile.name, await fetchFile(subtitleFile));
            setLoading('');
            notify({
                message: t('BURN_START'),
                level: 'info',
            });
            const output = `${Date.now()}.mp4`;
            await ffmpeg.run(
                '-i',
                videoFile ? videoFile.name : 'sample.mp4',
                '-vf',
                `ass=${subtitleFile.name}:fontsdir=/tmp`,
                '-preset',
                videoFile ? 'fast' : 'ultrafast',
                output,
            );
            const uint8 = ffmpeg.FS('readFile', output);
            download(URL.createObjectURL(new Blob([uint8])), `${output}`);
            setProcessing(0);
            ffmpeg.setProgress(() => null);
            notify({
                message: t('BURN_SUCCESS'),
                level: 'success',
            });
        } catch (error) {
            setLoading('');
            setProcessing(0);
            notify({
                message: t('BURN_ERROR'),
                level: 'error',
            });
        }
    }, [notify, setProcessing, setLoading, videoFile, subtitle]);

    const onVideoChange = useCallback(
        (event) => {
            const file = event.target.files[0];
            if (file) {
                const ext = getExt(file.name);
                const canPlayType = player.canPlayType(file.type);
                if (canPlayType === 'maybe' || canPlayType === 'probably') {
                    setVideoFile(file);
                    decodeAudioData(file);
                    const url = URL.createObjectURL(new Blob([file]));
                    waveform.decoder.destroy();
                    waveform.drawer.update();
                    waveform.seek(0);
                    player.currentTime = 0;
                    clearSubs();
                    setSubtitle([
                        newSub({
                            start: '00:00:00.000',
                            end: '00:00:01.000',
                            text: t('SUB_TEXT'),
                        }),
                    ]);
                    player.src = url;
                } else {
                    notify({
                        message: `${t('VIDEO_EXT_ERR')}: ${file.type || ext}`,
                        level: 'error',
                    });
                }
            }
        },
        [newSub, notify, player, setSubtitle, waveform, clearSubs, decodeAudioData],
    );
    const onYouTubeChange = useCallback(
        (event) => {
            if (youtubeURL.length > 0) {
                setLoading(t('LOADING'));

                fetch(
                    `https://youtube-dl-utils-api.herokuapp.com/get_youtube_video_link_with_captions?url=${youtubeURL}&lang=${translate}`,
                    {
                        method: 'POST',
                    },
                )
                    .then((resp) => {
                        return resp.json();
                    })
                    .then((resp) => {
                        const url = resp.video;
                        player.src = url;
                        const sub = resp.subtitles;

                        // console.log(url);

                        localStorage.setItem('videoSrc', resp.video);

                        fetch(sub)
                            .then((subtext) => {
                                return subtext.text();
                            })
                            .then((subtext) => {
                                player.currentTime = 0;
                                clearSubs();
                                const suburl = vtt2url(subtext);
                                url2sub(suburl).then((urlsub) => {
                                    setSubtitle(urlsub);
                                    localStorage.setItem('subtitle', JSON.stringify(urlsub));
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    });
                fetch(
                    `https://youtube-dl-utils-api.herokuapp.com/get_youtube_video_link_with_captions?url=${youtubeURL}&lang=en`,
                    {
                        method: 'POST',
                    },
                )
                    .then((resp) => {
                        return resp.json();
                    })
                    .then((resp) => {
                        //const url = resp.video;
                        setLoading('');

                        const sub = resp.subtitles;
                        fetch(sub)
                            .then((subtext) => {
                                return subtext.text();
                            })
                            .then((subtext) => {
                                clearSubsEnglish();
                                const suburl = vtt2url(subtext);
                                url2sub(suburl).then((urlsub) => {
                                    setSubtitleEnglish(urlsub);
                                    localStorage.setItem('subtitleEnglish', JSON.stringify(urlsub));
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    });
            }
        },
        [setSubtitleEnglish, clearSubs, youtubeURL, translate, clearSubsEnglish, player, setSubtitle, setLoading],
    );

    const handleChange = (e) => {
        setYoutubeURL(e.target.value);
    };

    const onSubtitleChange = useCallback(
        (event) => {
            const file = event.target.files[0];
            if (file) {
                const ext = getExt(file.name);
                if (['ass', 'vtt', 'srt', 'json'].includes(ext)) {
                    file2sub(file)
                        .then((res) => {
                            clearSubs();
                            setSubtitle(res);
                        })
                        .catch((err) => {
                            notify({
                                message: err.message,
                                level: 'error',
                            });
                        });
                } else {
                    notify({
                        message: `${t('SUB_EXT_ERR')}: ${ext}`,
                        level: 'error',
                    });
                }
            }
        },
        [notify, setSubtitle, clearSubs],
    );

    const onInputClick = useCallback((event) => {
        event.target.value = '';
    }, []);

    const downloadSub = useCallback(
        (type) => {
            let text = '';
            const name = `${Date.now()}.${type}`;
            switch (type) {
                case 'vtt':
                    text = sub2vtt(subtitle);
                    break;
                case 'srt':
                    text = sub2srt(subtitle);
                    break;
                case 'ass':
                    text = sub2ass(subtitle);
                    break;
                case 'txt':
                    text = sub2txt(subtitle);
                    break;
                case 'json':
                    text = JSON.stringify(subtitle);
                    break;
                default:
                    break;
            }
            const url = URL.createObjectURL(new Blob([text]));
            download(url, name);
        },
        [subtitle],
    );

    const downloadSubReference = useCallback(
        (type) => {
            let text = '';
            const name = `${Date.now()}.${type}`;
            switch (type) {
                case 'vtt':
                    text = sub2vtt(subtitleEnglish);
                    break;
                case 'srt':
                    text = sub2srt(subtitleEnglish);
                    break;
                case 'ass':
                    text = sub2ass(subtitleEnglish);
                    break;
                case 'txt':
                    text = sub2txt(subtitleEnglish);
                    break;
                case 'json':
                    text = JSON.stringify(subtitleEnglish);
                    break;
                default:
                    break;
            }
            const url = URL.createObjectURL(new Blob([text]));
            download(url, name);
        },
        [subtitleEnglish],
    );

    return (
        <Style className={`tool ${toolOpen ? 'tool-open' : ''}`}>
            <div className={`tool-button`}>
                <div
                    className="icon"
                    onClick={() => {
                        console.log('hamburger clicked');
                        setToolOpen(!toolOpen);
                    }}
                >
                    <HamburgerMenu
                        isOpen={toolOpen}
                        width={22}
                        height={18}
                        strokeWidth={2}
                        rotate={0}
                        color={'#fff'}
                        borderRadius={0}
                        animationDuration={0.5}
                    />
                </div>
            </div>

            <div className="top">
                <div className="import">
                    <div className="btn">
                        <Translate value="OPEN_VIDEO" />
                        <input className="file" type="file" onChange={onVideoChange} onClick={onInputClick} />
                    </div>
                    <div className="btn">
                        <Translate value="OPEN_SUB" />
                        <input className="file" type="file" onChange={onSubtitleChange} onClick={onInputClick} />
                    </div>
                </div>
                {window.crossOriginIsolated ? (
                    <div className="burn" onClick={burnSubtitles}>
                        <div className="btn">
                            <Translate value="EXPORT_VIDEO" />
                        </div>
                    </div>
                ) : null}
                <p style={{ paddingLeft: '10px', marginTop: '-0.5px' }}>
                    <b>Export Your Subtitles</b>
                </p>
                <div className="export" style={{ marginTop: '-20px' }}>
                    <div className="btn" onClick={() => downloadSub('ass')}>
                        <Translate value="EXPORT_ASS" />
                    </div>
                    <div className="btn" onClick={() => downloadSub('srt')}>
                        <Translate value="EXPORT_SRT" />
                    </div>
                    <div className="btn" onClick={() => downloadSub('vtt')}>
                        <Translate value="EXPORT_VTT" />
                    </div>
                </div>
                <p style={{ paddingLeft: '10px', marginTop: '-0.5px' }}>
                    <b>Export Reference Subtitles</b>
                </p>
                <div className="export" style={{ marginTop: '-20px' }}>
                    <div className="btn" onClick={() => downloadSubReference('ass')}>
                        <Translate value="EXPORT_ASS" />
                    </div>
                    <div className="btn" onClick={() => downloadSubReference('srt')}>
                        <Translate value="EXPORT_SRT" />
                    </div>
                    <div className="btn" onClick={() => downloadSubReference('vtt')}>
                        <Translate value="EXPORT_VTT" />
                    </div>
                </div>
                <div className="operate">
                    <div
                        className="btn"
                        onClick={() => {
                            if (window.confirm(t('CLEAR_TIP')) === true) {
                                localStorage.setItem('videoSrc', '/sample.mp4');
                                clearSubs();
                                clearSubsEnglish();
                                window.location.reload();
                            }
                        }}
                    >
                        <Translate value="CLEAR" />
                    </div>
                    <div className="btn" onClick={undoSubs}>
                        <Translate value="UNDO" />
                    </div>
                </div>
                <div className="operate">
                    <div className="btn" onClick={clearSubsHandler}>
                        <Translate value="Clear Subtitles" />
                    </div>
                </div>
                <div className="configuration">
                    <p className="configuration-heading">
                        <b>Configuration Options</b>
                    </p>
                    <div className="configuration-options">
                        <div
                            className="btn"
                            onClick={() => {
                                console.log('Configuration - basic');
                                setConfiguration('Subtitling');
                            }}
                        >
                            <Translate value="MAIN_LANGUAGE" />
                        </div>
                        <div
                            className="btn"
                            onClick={() => {
                                console.log('Configuration - sign');
                                setConfiguration('Sign Language Subtitling');
                            }}
                        >
                            <Translate value="SIGN_LANGUAGE" />
                        </div>
                        <div
                            className="btn"
                            onClick={() => {
                                console.log('Configuration - same');
                                setConfiguration('Same Language Subtitling');
                            }}
                        >
                            <Translate value="SAME_LANGUAGE" />
                        </div>
                    </div>
                </div>
                {/* <div className="translate">
                    <select
                        value={translate}
                        onChange={(event) => {
                            setTranslate(event.target.value);
                            localStorage.setItem('lang', event.target.value);
                        }}
                    >
                        {(languages[language] || languages.en).map((item) => (
                            <option key={item.key} value={item.key}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <div className="btn" onClick={onTranslate}>
                        <Translate value="TRANSLATE" />
                    </div>
                </div> */}
                <div className="youtube-link">
                    <textarea
                        className="youtube-textarea"
                        placeholder="Enter YouTube Link Here"
                        value={youtubeURL}
                        onChange={handleChange}
                        // onKeyPress={(e) => }
                    />
                    <div className="btn" onClick={onYouTubeChange}>
                        <Translate value="Fetch Video" />
                    </div>
                </div>
                <div className="hotkey">
                    <span>
                        <Translate value="HOTKEY_01" />
                    </span>
                    <span>
                        <Translate value="HOTKEY_02" />
                    </span>
                </div>
            </div>
        </Style>
    );
}
