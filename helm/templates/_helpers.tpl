{{- define "yarilomail-web.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "yarilomail-web.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "yarilomail-web.labels" -}}
app.kubernetes.io/name: {{ include "yarilomail-web.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end -}}

{{- define "yarilomail-web.selectorLabels" -}}
app.kubernetes.io/name: {{ include "yarilomail-web.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
